import { useState } from 'react'
import { consultationRequest, waitlistRequest, sendRequest } from '../lib/api.js'

// musait=true → danışmanlık talebi (ad, telefon, e-posta)
// musait=false → kontenjan bildirimi (ad, e-posta)
const TURLER = {
  talep: {
    buton: 'Danışmanlık Talep Et',
    alanlar: ['name', 'phone', 'email'],
    istek: consultationRequest,
    onay: ({ name }) =>
      `Teşekkürler ${name}! Talebin bize ulaştı; seansını planlamak için kısa süre içinde seninle iletişime geçeceğiz.`,
  },
  bekleme: {
    buton: 'Kontenjan Açılınca Haber Ver',
    alanlar: ['name', 'email'],
    istek: waitlistRequest,
    onay: ({ email }) =>
      `Teşekkürler! Kontenjan açıldığında ${email} adresine haber vereceğiz.`,
  },
}

const ALANLAR = {
  name: { etiket: 'Ad Soyad', type: 'text', autoComplete: 'name' },
  phone: {
    etiket: 'Telefon',
    type: 'tel',
    autoComplete: 'tel',
    inputMode: 'numeric',
    placeholder: '05xxxxxxxxx',
  },
  email: { etiket: 'E-posta', type: 'email', autoComplete: 'email' },
}

const BOS_FORM = { name: '', phone: '', email: '', riza: false }

export default function RequestForm({ paket }) {
  const tur = paket.musait ? TURLER.talep : TURLER.bekleme
  const [acik, setAcik] = useState(false)
  const [form, setForm] = useState(BOS_FORM)
  const [durum, setDurum] = useState('bos') // bos | gonderiliyor | basarili | hata
  const [hata, setHata] = useState('')

  const degistir = (e) => {
    const { name, type, checked, value } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const gonder = async (e) => {
    e.preventDefault()

    const veri = Object.fromEntries(tur.alanlar.map((alan) => [alan, form[alan].trim()]))
    if (tur.alanlar.some((alan) => !veri[alan])) {
      setDurum('hata')
      setHata('Lütfen tüm alanları doldur.')
      return
    }
    if (!form.riza) {
      setDurum('hata')
      setHata('Devam etmek için kişisel verilerinin işlenmesine açık rıza vermelisin.')
      return
    }

    setForm({ ...form, ...veri })
    setDurum('gonderiliyor')
    try {
      await sendRequest(tur.istek(paket, veri, form.riza))
      setDurum('basarili')
    } catch (err) {
      setDurum('hata')
      setHata(err.message)
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
            inputMode={ALANLAR[alan].inputMode}
            placeholder={ALANLAR[alan].placeholder}
            value={form[alan]}
            onChange={degistir}
            required
            disabled={gonderiliyor}
          />
        </label>
      ))}

      <label className="riza">
        <input
          name="riza"
          type="checkbox"
          checked={form.riza}
          onChange={degistir}
          required
          disabled={gonderiliyor}
        />
        <span>
          Kişisel verilerimin{' '}
          <a href="/gizlilik.html" target="_blank" rel="noopener">Gizlilik Politikası</a>{' '}
          kapsamında işlenmesine açık rıza veriyorum.
        </span>
      </label>

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
