import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/Header.jsx'
import GizlilikPolitikasi from './components/GizlilikPolitikasi.jsx'
import Footer from './components/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <main>
      <GizlilikPolitikasi />
    </main>
    <Footer />
  </StrictMode>
)
