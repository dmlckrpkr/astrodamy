// Webhook gönderimi ve payload'lar. Ürün alanlarından payload'a eşleme yalnızca burada yapılır
// (productId → productId, ad → productName).

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL
const SOURCE = 'astrodamy-web'

export const consultationPayload = (paket, { name, phone, email }) => ({
  event: 'consultation_request',
  name,
  productId: paket.productId,
  productName: paket.ad,
  phone,
  email,
  quantity: 1,
  source: SOURCE,
})

export const waitlistPayload = (paket, { name, email }) => ({
  event: 'waitlist_request',
  name,
  productId: paket.productId,
  productName: paket.ad,
  email,
  source: SOURCE,
})

export async function sendWebhook(payload) {
  if (!WEBHOOK_URL) {
    throw new Error('VITE_WEBHOOK_URL tanımlı değil (.env.local).')
  }

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Webhook yanıtı: ${response.status}`)
  }
}
