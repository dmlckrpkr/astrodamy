import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Content-Security-Policy yalnızca production build'ine <meta> olarak eklenir. vercel.json'da
// başlık olarak verilseydi `vercel dev`'de de uygulanır ve Vite'ın geliştirme modundaki satır içi
// script/style'larını engellerdi. frame-ancestors <meta>'da desteklenmez; iframe'e gömülmeyi
// vercel.json'daki X-Frame-Options: DENY engeller.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const cspMeta = {
  name: 'csp-meta',
  apply: 'build',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
      injectTo: 'head-prepend',
    },
  ],
}

export default defineConfig({
  plugins: [react(), cspMeta],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        gizlilik: 'gizlilik.html',
      },
    },
  },
})
