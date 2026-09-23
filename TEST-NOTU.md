# Test Notu — `POST /api/request`

- **Tarih:** 22 Eylül 2026
- **Ortam:** yerel `vercel dev` (http://localhost:3000), Vercel CLI 59.25.4, Node.js 24.18.0
- **Araç:** `curl`
- **Sonuç:** 8 testin 8'i beklendiği gibi ✅

## Rate limit sayacının temizliği

Sayaç, Vercel Runtime Cache'te **IP + o anki dakika** anahtarıyla tutulur. Yeni bir dakikada anahtar da
yenidir, yani sayaç sıfırdan başlar. Bu yüzden:

- 1–7. testler yeni bir dakikanın başında çalıştırıldı (22:54:00–22:54:07, toplam 7 istek; 10'luk sınırın altında).
- 8. test bir sonraki dakikanın başında, temiz bir sayaçla çalıştırıldı (22:55:00–22:55:10).

## Sonuçlar

| # | Test | Beklenen | Gelen HTTP kodu | Dönen mesaj |
|---|---|---|---|---|
| 1 | Geçerli `consultation_request` (`dogum-haritasi`) | 200 | 200 ✅ | `{"ok":true}` |
| 2 | Geçerli `waitlist_request` (`sinastri`) | 200 | 200 ✅ | `{"ok":true}` |
| 3 | Hatalı e-posta (`abc@`) | 400 | 400 ✅ | Lütfen geçerli bir e-posta adresi gir. |
| 4 | `consent: false` | 400 | 400 ✅ | Devam etmek için kişisel verilerinin işlenmesine açık rıza vermelisin. |
| 5 | Olmayan `productId` (`tarot`) | 400 | 400 ✅ | Seçilen danışmanlık paketi bulunamadı. |
| 6 | Kısa telefon (`12345`) | 400 | 400 ✅ | Telefon numarası yalnızca rakamlardan oluşmalı ve 10-11 haneli olmalıdır. |
| 7 | Boş isim (`""`) | 400 | 400 ✅ | Ad Soyad alanı zorunludur. |
| 8 | Rate limit: 1 dakika içinde art arda 12 istek | 1–10: sınıra takılmaz, 11–12: 429 | 1–10: 400, 11–12: 429 ✅ | 11–12: Çok fazla istek gönderdin. Lütfen bir dakika bekleyip tekrar dene. |

## Notlar

- 1. ve 2. testler webhook.site adresine gerçekten iletildi ("Test Kullanici", `test@example.com`).
- 8. testte 12 isteğin hepsi hatalı e-postayla (`abc@`) gönderildi. Böylece hiçbiri webhook'a
  iletilmedi. Rate limit kontrolü validasyondan önce çalıştığı için 1–10. istekler validasyona kadar
  ulaşıp 400 aldı, 11. istekten itibaren 429 döndü. 429 yanıtında `Retry-After: 60` başlığı da var.
- 400 yanıtlarında `error` alanının yanında aynı mesajları dizi olarak veren bir `errors` alanı da döner.
  Tabloda `error` alanı gösterildi.
