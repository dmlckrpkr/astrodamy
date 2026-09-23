import { products } from '../data/products.js'
import ProductList from './ProductList.jsx'

export default function Danismanlik() {
  return (
    <section id="danismanlik">
      <h2>Astroloji Danışmanlığı</h2>
      <p className="alt-baslik">Birebir online seanslar</p>
      <ProductList paketler={products} />
    </section>
  )
}
