// Form gönderimleri /api/request'e gider; doğrulama ve webhook'a iletme sunucuda yapılır
// (bkz. api/request.js). Webhook adresi tarayıcıda hiç bulunmaz.

const SOURCE = 'astrodamy-web'

export const consultationRequest = (paket, { name, phone, email }, consent) => ({
  event: 'consultation_request',
  productId: paket.productId,
  name,
  phone,
  email,
  consent,
  source: SOURCE,
})

export const waitlistRequest = (paket, { name, email }, consent) => ({
  event: 'waitlist_request',
  productId: paket.productId,
  name,
  email,
  consent,
  source: SOURCE,
})

const GENEL_HATA = 'Gönderim sırasında bir sorun oluştu. Lütfen biraz sonra tekrar dene.'

// Başarısızlıkta sunucunun Türkçe hata mesajıyla Error fırlatır.
export async function sendRequest(body) {
  let response
  try {
    response = await fetch('/api/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error(GENEL_HATA)
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.error || GENEL_HATA)
  }
}
