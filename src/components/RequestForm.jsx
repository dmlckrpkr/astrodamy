import { useState } from 'react'
import { consultationPayload, waitlistPayload, sendWebhook } from '../lib/webhook.js'

// musait=true → danışmanlık talebi (ad, telefon, e-posta)
// musait=false → kontenjan bildirimi (ad, e-posta)
const TURLER = {
  talep: {
    buton: 'Danışmanlık Talep Et',
    alanlar: ['name', 'phone', 'email'],
    payload: consultationPayload,
    onay: ({ name }) =>
      `Teşekkürler ${name}! Talebin bize ulaştı; seansını planlamak için kısa süre içinde seninle iletişime geçeceğiz.`,
  },
  bekleme: {
    buton: 'Kontenjan Açılınca Haber Ver',
    alanlar: ['name', 'email'],
    payload: waitlistPayload,
    onay: ({ email }) =>
      `Teşekkürler! Kontenjan açıldığında ${email} adresine haber vereceğiz.`,
  },
}

const ALANLAR = {
  name: { etiket: 'Ad Soyad', type: 'text', autoComplete: 'name' },
  phone: { etiket: 'Telefon', type: 'tel', autoComplete: 'tel' },
  email: { etiket: 'E-posta', type: 'email', autoComplete: 'email' },
}

const BOS_FORM = { name: '', phone: '', email: '' }

export default function RequestForm({ paket }) {
  const tur = paket.musait ? TURLER.talep : TURLER.bekleme
  const [acik, setAcik] = useState(false)
  const [form, setForm] = useState(BOS_FORM)
  const [durum, setDurum] = useState('bos') // bos | gonderiliyor | basarili | hata
  const [hata, setHata] = useState('')

  const degistir = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const gonder = async (e) => {
    e.preventDefault()

    const veri = Object.fromEntries(tur.alanlar.map((alan) => [alan, form[alan].trim()]))
    if (tur.alanlar.some((alan) => !veri[alan])) {
      setDurum('hata')
      setHata('Lütfen tüm alanları doldur.')
      return
    }

    setForm({ ...form, ...veri })
    setDurum('gonderiliyor')
    try {
      await sendWebhook(tur.payload(paket, veri))
      setDurum('basarili')
    } catch (err) {
      console.error(err)
      setDurum('hata')
      setHata('Gönderim sırasında bir sorun oluştu. Lütfen biraz sonra tekrar dene.')
    }
  }

  if (durum === 'basarili') {
    return <p className="form-mesaj onay">{tur.onay(form)}</p>
  }

  if (!acik) {
    return (
      <button type="button" className="buton" onClick={() => setAcik(true)}>
        {tur.buton}
      </button>
    )
  }

  const gonderiliyor = durum === 'gonderiliyor'

  return (
    <form className="talep-formu" onSubmit={gonder}>
      {tur.alanlar.map((alan) => (
        <label key={alan}>
          {ALANLAR[alan].etiket}
          <input
            name={alan}
            type={ALANLAR[alan].type}
            autoComplete={ALANLAR[alan].autoComplete}
            value={form[alan]}
            onChange={degistir}
            required
            disabled={gonderiliyor}
          />
        </label>
      ))}

      {durum === 'hata' && <p className="form-mesaj hata" role="alert">{hata}</p>}

      <div className="form-butonlar">
        <button type="submit" className="buton" disabled={gonderiliyor}>
          {gonderiliyor ? 'Gönderiliyor…' : 'Gönder'}
        </button>
        <button
          type="button"
          className="buton ikincil"
          onClick={() => { setAcik(false); setDurum('bos') }}
          disabled={gonderiliyor}
        >
          Vazgeç
        </button>
      </div>
    </form>
  )
}
