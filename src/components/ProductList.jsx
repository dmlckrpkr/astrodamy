import ProductCard from './ProductCard.jsx'

export default function ProductList({ paketler }) {
  return (
    <div className="paketler">
      {paketler.map((paket) => (
        <ProductCard key={paket.productId} {...paket} />
      ))}
    </div>
  )
}
