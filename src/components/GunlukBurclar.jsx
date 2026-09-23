import { burclar, gunlukTarih } from '../data.js'

export default function GunlukBurclar() {
  return (
    <section id="gunluk">
      <h2>Günlük Burç Yorumları</h2>
      <p className="alt-baslik">{gunlukTarih}</p>
      <div className="burclar">
        {burclar.map((burc) => (
          <div className="burc" key={burc.ad}>
            <h3><span className="sembol">{burc.sembol}</span>{burc.ad}</h3>
            <div className="tarih">{burc.tarih}</div>
            <p>{burc.yorum}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
