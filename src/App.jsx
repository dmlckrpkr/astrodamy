import Header from './components/Header.jsx'
import GunlukBurclar from './components/GunlukBurclar.jsx'
import AylikYorum from './components/AylikYorum.jsx'
import Danismanlik from './components/Danismanlik.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <GunlukBurclar />
        <AylikYorum />
        <Danismanlik />
      </main>
      <Footer />
    </>
  )
}
