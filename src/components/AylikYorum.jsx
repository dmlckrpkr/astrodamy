import { Fragment } from 'react'
import { aylik } from '../data.js'

export default function AylikYorum() {
  return (
    <section id="aylik">
      <h2>Aylık Genel Yorum</h2>
      <p className="alt-baslik">{aylik.donem}</p>
      <div className="aylik">
        {aylik.basliklar.map(({ baslik, metin }) => (
          <Fragment key={baslik}>
            <h3>{baslik}</h3>
            <p>{metin}</p>
          </Fragment>
        ))}
      </div>
    </section>
  )
}
