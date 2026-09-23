// POST /api/request — form gönderimlerini doğrulayıp WEBHOOK_URL adresine iletir.
// Webhook adresi yalnızca sunucuda (process.env.WEBHOOK_URL) durur, tarayıcıya hiç gitmez.

import { getCache } from '@vercel/functions'
import { getProductById } from '../src/data/products.js'
import { epostaGecerli, EPOSTA_HATA } from '../src/lib/eposta.js'

// İsteğin geldiği uygulama. Gönderilmezse web sayılır (eski sürüm sayfalar source göndermiyordu).
const KAYNAKLAR = ['astrodamy-web', 'astrodamy-mobile']
const VARSAYILAN_KAYNAK = 'astrodamy-web'

// --- Rate limit: IP başına dakikada 10 istek ---
// Sayaç Vercel Runtime Cache'te tutulur; her istek ayrı bir örnekte çalışsa da ortak sayaç görülür.
// Sabit pencere: anahtar IP + o anki dakika. Okuma-yazma atomik olmadığı için aynı anda gelen
// isteklerde sınır birkaç istek aşılabilir; bu site için yeterli.
const LIMIT = 10
const PENCERE_MS = 60 * 1000
const cache = getCache({ namespace: 'rate-limit' })

async function limitAsildi(ip) {
  const anahtar = `${ip}:${Math.floor(Date.now() / PENCERE_MS)}`
  try {
    const sayi = ((await cache.get(anahtar)) ?? 0) + 1
    await cache.set(anahtar, sayi, { ttl: PENCERE_MS / 1000, name: 'rate-limit' })
    return sayi > LIMIT
  } catch (err) {
    // Cache'e ulaşılamazsa formu kilitlemek yerine isteği geçir
    console.error('Rate limit cache hatası:', err)
    return false
  }
}

function istemciIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return String(forwarded).split(',')[0].trim()
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'bilinmiyor'
}

// --- Validasyon ---
const TELEFON = /^\d{10,11}$/

const metin = (deger) => (typeof deger === 'string' ? deger.trim() : '')

// Her event için zorunlu alanlar ve paketin müsaitlik durumu
const EVENTLER = {
  consultation_request: { alanlar: ['name', 'phone', 'email'], musait: true },
  waitlist_request: { alanlar: ['name', 'email'], musait: false },
}

const ALAN_ADLARI = { name: 'Ad Soyad', phone: 'Telefon', email: 'E-posta' }

function dogrula(govde) {
  // hasOwn: "constructor", "__proto__" gibi Object.prototype anahtarları event sayılmasın
  const tanim = Object.hasOwn(EVENTLER, govde.event) ? EVENTLER[govde.event] : null
  if (!tanim) return { hatalar: ['Geçersiz istek türü.'] }

  const veri = {
    name: metin(govde.name),
    phone: metin(govde.phone),
    email: metin(govde.email).toLowerCase(),
    source: govde.source ?? VARSAYILAN_KAYNAK,
  }
  const hatalar = []

  for (const alan of tanim.alanlar) {
    if (!veri[alan]) hatalar.push(`${ALAN_ADLARI[alan]} alanı zorunludur.`)
  }

  if (veri.name && (veri.name.length < 2 || veri.name.length > 60)) {
    hatalar.push('Ad Soyad 2 ile 60 karakter arasında olmalıdır.')
  }
  if (tanim.alanlar.includes('phone') && veri.phone && !TELEFON.test(veri.phone)) {
    hatalar.push('Telefon numarası yalnızca rakamlardan oluşmalı ve 10-11 haneli olmalıdır.')
  }
  if (veri.email && !epostaGecerli(veri.email)) {
    hatalar.push(EPOSTA_HATA)
  }

  const paket = getProductById(govde.productId)
  if (!paket) {
    hatalar.push('Seçilen danışmanlık paketi bulunamadı.')
  } else if (paket.musait !== tanim.musait) {
    hatalar.push(
      paket.musait
        ? 'Bu paketin kontenjanı açık; bekleme listesi yerine danışmanlık talebi oluşturabilirsin.'
        : 'Bu paketin kontenjanı dolu; kontenjan açılınca haber almak için bekleme listesine katılabilirsin.'
    )
  }

  if (!KAYNAKLAR.includes(veri.source)) {
    hatalar.push('Geçersiz istek kaynağı.')
  }

  if (govde.consent !== true) {
    hatalar.push('Devam etmek için kişisel verilerinin işlenmesine açık rıza vermelisin.')
  }

  return { hatalar, veri, paket }
}

// Ürün alanlarından payload'a eşleme: productId → productId, ad → productName
function payloadOlustur(event, paket, { name, phone, email, source }) {
  const ortak = {
    event,
    name,
    productId: paket.productId,
    productName: paket.ad,
    email,
    consent: true,
    consentAt: new Date().toISOString(),
    source,
  }
  return event === 'consultation_request' ? { ...ortak, phone, quantity: 1 } : ortak
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Bu adres yalnızca POST isteği kabul eder.' })
  }

  if (await limitAsildi(istemciIp(req))) {
    res.setHeader('Retry-After', String(PENCERE_MS / 1000))
    return res
      .status(429)
      .json({ error: 'Çok fazla istek gönderdin. Lütfen bir dakika bekleyip tekrar dene.' })
  }

  // Vercel, bozuk JSON'da req.body okunurken hata fırlatır
  let govde
  try {
    govde = req.body
  } catch {
    govde = null
  }
  if (typeof govde === 'string') {
    try {
      govde = JSON.parse(govde)
    } catch {
      govde = null
    }
  }
  if (!govde || typeof govde !== 'object') {
    return res.status(400).json({ error: 'İstek gövdesi okunamadı.' })
  }

  const { hatalar, veri, paket } = dogrula(govde)
  if (hatalar.length > 0) {
    return res.status(400).json({ error: hatalar.join(' '), errors: hatalar })
  }

  const webhookUrl = process.env.WEBHOOK_URL
  if (!webhookUrl) {
    console.error('WEBHOOK_URL tanımlı değil.')
    return res
      .status(500)
      .json({ error: 'Sunucu yapılandırması eksik. Lütfen daha sonra tekrar dene.' })
  }

  try {
    const yanit = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadOlustur(govde.event, paket, veri)),
    })
    if (!yanit.ok) throw new Error(`Webhook yanıtı: ${yanit.status}`)
  } catch (err) {
    console.error(err)
    return res
      .status(502)
      .json({ error: 'Talebin iletilirken bir sorun oluştu. Lütfen biraz sonra tekrar dene.' })
  }

  return res.status(200).json({ ok: true })
}
