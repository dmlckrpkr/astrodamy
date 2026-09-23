# AstroDamy ✦

AstroDamy, astroloji içerikleri ve birebir online danışmanlık sunan tek kişilik bir dijital hizmetin
tanıtım sayfası. Ücretsiz günlük burç yorumları ve aylık genel yorumla ziyaretçi çeker, ziyaretçileri
ücretli danışmanlık paketlerine yönlendirir.

AtölyeKart Haftalık Ödev Serisi — Hafta 1. Vite + React ile hazırlandı.

## Neler var?

- **Günlük Burç Yorumları:** 12 burç
- **Aylık Genel Yorum:** ayın enerjisi, aşk, iş/para
- **Danışmanlık paketleri:** Doğum Haritası Analizi, Numeroloji Okuması, Sinastri
- **İki webhook formu:**
  - Müsait paketlerde **Danışmanlık Talep Et** (`consultation_request`)
  - Kontenjanı dolu paketlerde **Kontenjan Açılınca Haber Ver** (`waitlist_request`)

## Çalıştırma

```bash
npm install
npm run dev
```

Sayfa http://localhost:5173 adresinde açılır.

## Webhook ayarı

Formların gönderileceği adresi proje kökündeki `.env.local` dosyasına yaz:

```
VITE_WEBHOOK_URL=https://webhook.site/<kendi-adresin>
```

- `.env.local` git'e eklenmez; her kurulumda bu dosyayı kendin oluşturman gerekir.
- Dosyayı değiştirdikten sonra `npm run dev` kendini yeniden başlatır.
- webhook.site kullanıyorsan ayarlardan **Add CORS headers** seçeneğini aç. Aksi halde tarayıcı
  isteği engeller.

## Proje yapısı

```
src/
  data.js               günlük ve aylık yorum içerikleri
  data/products.js      danışmanlık paketleri (productId, ad, fiyat, sure, musait…)
  lib/webhook.js        webhook payload'ları ve gönderim
  components/           Header, GunlukBurclar, AylikYorum, Danismanlik,
                        ProductList, ProductCard, ProductImage, RequestForm, Footer
index-statik.html       React'e geçmeden önceki statik sürüm
```
