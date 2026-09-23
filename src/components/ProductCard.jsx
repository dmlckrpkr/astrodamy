import ProductImage from './ProductImage.jsx'
import RequestForm from './RequestForm.jsx'

const fiyatYaz = (fiyat) => `${fiyat.toLocaleString('tr-TR')} ₺`

export default function ProductCard({ productId, ikon, ad, fiyat, sure, musait, aciklama }) {
  return (
    <div className={musait ? 'paket' : 'paket dolu'}>
      {!musait && <span className="rozet">Kontenjan dolu</span>}
      <ProductImage ikon={ikon} />
      <h3>{ad}</h3>
      <p className="fiyat">{fiyatYaz(fiyat)}</p>
      <p className="sure">{sure} dk · online</p>
      <p className="aciklama">{aciklama}</p>
      <RequestForm paket={{ productId, ad, musait }} />
    </div>
  )
}
