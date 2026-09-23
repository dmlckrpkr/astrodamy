# AstroDamy ✦

AstroDamy, astroloji içerikleri ve birebir online danışmanlık sunan tek kişilik bir dijital hizmetin
tanıtım sayfası. Ücretsiz günlük burç yorumları ve aylık genel yorumla ziyaretçi çeker, ziyaretçileri
ücretli danışmanlık paketlerine yönlendirir.

AtölyeKart Haftalık Ödev Serisi — Hafta 2. Vite + React ile hazırlandı; formlar Vercel serverless
API route'u üzerinden gönderilir.

## Neler var?

- **Günlük Burç Yorumları:** 12 burç
- **Aylık Genel Yorum:** ayın enerjisi, aşk, iş/para
- **Danışmanlık paketleri:** Doğum Haritası Analizi, Numeroloji Okuması, Sinastri; kategori filtresi
  (Tümü / Harita / Sayılar / İlişki)
- **İki form:**
  - Müsait paketlerde **Danışmanlık Talep Et** (`consultation_request`)
  - Kontenjanı dolu paketlerde **Kontenjan Açılınca Haber Ver** (`waitlist_request`)
- **KVKK:** iki formda da zorunlu açık rıza kutusu ve `/gizlilik.html` Gizlilik Politikası sayfası

## Çalıştırma

API route'u da çalışsın diye `vercel dev` kullan (`npm run dev` yalnızca arayüzü açar, formlar çalışmaz):

```bash
npm install
vercel dev
```

Sayfa http://localhost:3000 adresinde açılır. Proje Vercel'de `astrodamy` olarak bağlı; yeni bir
makinede önce `vercel link` çalıştır.

## Webhook ayarı

Form verileri tarayıcıdan doğrudan webhook'a gitmez. Tarayıcı `/api/request`'e POST eder, sunucu
veriyi doğrular ve `WEBHOOK_URL` adresine iletir. Adres yalnızca sunucuda durur.

Adres Vercel projesinde `WEBHOOK_URL` ortam değişkeni olarak durur (Development ve Production).
Yerelde `.env.local` dosyasına çekmek için:

```bash
vercel env pull .env.local
```

Böylece `.env.local` şöyle görünür (şablon için `.env.example`):

```
WEBHOOK_URL=https://webhook.site/<kendi-adresin>
```

- `vercel dev`, fonksiyonlara `.env.local`'i değil Vercel'deki Development değişkenlerini verir.
  Adresi değiştirirsen Vercel'de de güncelle (`vercel env update WEBHOOK_URL development`), sonra
  `vercel dev`'i yeniden başlat.
- `.env*` dosyaları git'e eklenmez (`.env.example` hariç).
- İstek sunucudan gittiği için webhook.site'ta CORS ayarına gerek yok.

## API: `POST /api/request`

Gövde (JSON):

| Alan | `consultation_request` | `waitlist_request` |
|---|---|---|
| `event` | zorunlu | zorunlu |
| `productId` | müsait bir paket | kontenjanı dolu bir paket |
| `name` | 2–60 karakter | 2–60 karakter |
| `email` | geçerli e-posta | geçerli e-posta |
| `phone` | yalnızca rakam, 10–11 hane | — |
| `consent` | `true` olmalı | `true` olmalı |

Yanıtlar:

- `200 { ok: true }`: webhook'a iletildi
- `400 { error, errors }`: validasyon hatası (Türkçe mesaj, form bunu gösterir)
- `405`: POST dışında bir method
- `429`: IP başına dakikada 10 istek aşıldı
- `500`: `WEBHOOK_URL` tanımlı değil
- `502`: webhook'a iletilemedi

Sunucu, webhook'a giden payload'ı kendisi oluşturur. `productName` her zaman `products.js`'ten
alınır, istemcinin gönderdiğine güvenilmez. Payload'a `consent: true` ve `consentAt` zaman damgası
eklenir.

Rate limit sayacı Vercel Runtime Cache'te (`@vercel/functions`) tutulur. Böylece farklı sunucu
örnekleri aynı sayacı görür; `vercel dev` de yerelde bir Runtime Cache başlatır. Sayaç bölgeye göre
ayrıdır ve artırma işlemi atomik değildir, bu yüzden aynı anda gelen isteklerde sınır birkaç istek
aşılabilir. Kesin bir sınır için Upstash Redis gibi bir veritabanı gerekir.

## Proje yapısı

```
api/
  request.js            form gönderimi: validasyon, rate limit, webhook'a iletme
src/
  data.js               günlük ve aylık yorum içerikleri
  data/products.js      danışmanlık paketleri (productId, kategori, ad, fiyat, sure, musait…)
                        ve filtre kategorileri
  lib/api.js            /api/request istemcisi
  gizlilik.jsx          Gizlilik Politikası sayfasının girişi
  components/           Header, GunlukBurclar, AylikYorum, Danismanlik, ProductList,
                        ProductCard, ProductImage, RequestForm, GizlilikPolitikasi, Footer
index.html              ana sayfa
gizlilik.html           Gizlilik Politikası sayfası
index-statik.html       React'e geçmeden önceki statik sürüm
```
