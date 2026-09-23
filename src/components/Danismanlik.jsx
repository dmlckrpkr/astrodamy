import { useState } from 'react'
import { products, kategoriler } from '../data/products.js'
import ProductList from './ProductList.jsx'

export default function Danismanlik() {
  const [secili, setSecili] = useState('tumu')
  const gorunen = secili === 'tumu' ? products : products.filter((p) => p.kategori === secili)

  return (
    <section id="danismanlik">
      <h2>Astroloji Danışmanlığı</h2>
      <p className="alt-baslik">Birebir online seanslar</p>
      <div className="filtre" role="group" aria-label="Paketleri kategoriye göre filtrele">
        {kategoriler.map((k) => (
          <button
            key={k.id}
            type="button"
            className={k.id === secili ? 'filtre-buton secili' : 'filtre-buton'}
            aria-pressed={k.id === secili}
            onClick={() => setSecili(k.id)}
          >
            {k.ad}
          </button>
        ))}
      </div>
      <ProductList paketler={gorunen} />
    </section>
  )
}
