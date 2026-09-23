# Güvenlik Kontrol Listesi — Deploy Öncesi (2.6)

- **Tarih:** 22 Eylül 2026
- **Kontrol edilen:** `main` dalı ve canlı site https://astrodamy.vercel.app
- **Yöntem:** her madde projede ve canlı sitede komutla kontrol edildi. Kullanılan komutlar her maddenin altında.

## Özet

| # | Madde | Durum | Kısa açıklama |
|---|---|---|---|
| 1 | Secret'lar | ✅ | Webhook adresi yalnızca sunucuda; repoda, git geçmişinde ve tarayıcıya giden JS'te yok |
| 2 | `.gitignore` | ✅ | `.env*` ve `.vercel` dışlanıyor; takip edilen tek env dosyası değersiz `.env.example` |
| 3 | Server-side validasyon | ✅ | Tüm alanlar sunucuda doğrulanıyor; kontrolde bulunan 3 açık bu committe kapatıldı |
| 4 | Rate limit | ⚠️ | IP sahtelenemiyor, ama canlıda hızlı art arda gelen istekler sınırı aşabiliyor |
| 5 | KVKK / açık rıza | ⚠️ | Rıza kutusu, sunucu kontrolü ve politika sayfası tamam; veriler hâlâ webhook.site'a gidiyor |
| 6 | HTTPS | ✅ | HTTP → HTTPS 308 yönlendirmesi ve HSTS var |
| 6a | Güvenlik başlıkları (ek) | ⚠️ | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy yok |
| 7 | Hata mesajlarında iç bilgi sızmaması | ✅ | Kullanıcıya yalnızca genel Türkçe mesajlar dönüyor; ayrıntı sadece sunucu loglarında |
| 8 | Bağımlılık güvenliği / `npm audit` | ✅ | 0 açık; yalnızca güvenlikle ilgisi olmayan major güncellemeler var |

## 1. Secret'lar ✅

- Webhook adresi `process.env.WEBHOOK_URL` olarak yalnızca `api/request.js`'te okunuyor. `src/` içinde
  `VITE_` ya da `import.meta.env` kullanımı yok.
- Git geçmişinin tamamında webhook.site adresi, JWT benzeri token ya da `VERCEL_OIDC_TOKEN` yok.
- Canlı sitenin tarayıcıya gönderdiği tüm JS dosyalarında (236 KB) `webhook.site` ve `WEBHOOK_URL`
  geçmiyor. Tarayıcı yalnızca `/api/request` adresini biliyor.
- Vercel'de `WEBHOOK_URL` Production için gizli (Secret) olarak saklanıyor.

```bash
git log --all -p | grep -cE 'webhook\.site/[0-9a-f]{8}-'      # 0
git log --all -p | grep -cE 'eyJ[A-Za-z0-9_-]{30,}'            # 0
grep -rn 'VITE_\|import\.meta\.env' src                        # sonuç yok
```

## 2. `.gitignore` ✅

- `.env*` (`.env.example` hariç), `*.local`, `.vercel`, `node_modules`, `dist` dışlanıyor.
- `git check-ignore`: `.env`, `.env.local`, `.env.production.local`, `.vercel/project.json` → dışlanıyor.
- `git ls-files` içinde tek env dosyası `.env.example`, içindeki değer boş.

## 3. Server-side validasyon ✅

Sunucu, istemciden gelen hiçbir şeye güvenmiyor. Webhook'a gidecek veriyi kendisi oluşturuyor ve
paket adını `products.js`'ten alıyor.

| Alan | Kural |
|---|---|
| `event` | yalnızca `consultation_request` / `waitlist_request` |
| `productId` | `products.js`'te olmalı; müsait pakete bekleme listesi, dolu pakete talep yapılamaz |
| `name` | 2–60 karakter |
| `email` | trim + küçük harf, domain'in her parçası dolu, en fazla 254 karakter |
| `phone` | yalnızca rakam, 10–11 hane |
| `consent` | `true` olmalı |

Bu kontrol sırasında canlı sitede bulunan ve **bu committe düzeltilen** üç açık:

1. `"event": "constructor"` gönderilince fonksiyon çöküyordu (500). `Object.prototype`'tan gelen
   anahtarlar event sayılıyordu. Artık `Object.hasOwn` ile kontrol ediliyor, 400 dönüyor.
2. Bozuk JSON gönderilince Türkçe mesaj yerine boş bir 400 dönüyordu. Artık "İstek gövdesi okunamadı." dönüyor.
3. E-posta uzunluğu sınırsızdı. Artık en fazla 254 karakter.

Diğer denemeler zaten doğru sonuç veriyordu: nesne olarak isim (`{"$gt":""}`), `productId: "__proto__"`,
dizi gövde, `text/plain` gövde, boş gövde.

Test sonuçları: `TEST-NOTU.md`.

## 4. Rate limit ⚠️

Kural: IP başına dakikada 10 istek. Sayaç Vercel Runtime Cache'te tutuluyor.

**Çalışanlar:**
- **Yerelde** (`vercel dev`) 11. istekten itibaren 429 dönüyor.
- **IP sahtelenemiyor:** canlıda her isteğe farklı sahte `X-Forwarded-For` / `X-Real-IP` yazıldığında
  da sınır devreye girdi. Vercel bu başlığı gerçek istemci IP'siyle değiştiriyor.
- **Aralıklı isteklerde çalışıyor:** 1,5 saniyede bir gönderilen 12 istekte 12. istek 429 aldı.

**Sorun:**
- **Hızlı art arda isteklerde sınır tutmuyor:** canlıda arka arkaya 12 istekte yalnızca 7. istek 429
  aldı, diğerleri geçti. Runtime Cache'e yazılan sayı bir sonraki isteğe hemen yansımıyor. Ayrıca
  okuma-yazma atomik değil.
- **Cache'e ulaşılamazsa istek geçiriliyor** (fail-open). Bu bilerek seçildi, formu kilitlememek için.

**Öneri:** atomik sayaç (`INCR` + `EXPIRE`) için Upstash Redis (Vercel Marketplace). Vercel'de ücretsiz
katmanla kurulabilir ama hesapta yeni bir servis açmayı gerektiriyor.

## 5. KVKK / açık rıza ⚠️

**Tamam olanlar:**
- **Rıza kutusu:** iki formda da zorunlu, metni "Kişisel verilerimin Gizlilik Politikası kapsamında
  işlenmesine açık rıza veriyorum".
- **Sunucu kontrolü:** `consent !== true` ise istek 400 ile reddediliyor; tarayıcıyı atlasan da geçemiyor.
- **Rıza kaydı:** webhook'a giden veride `consent: true` ve `consentAt` (zaman damgası) var.
- **Gizlilik Politikası:** `/gizlilik.html` sayfasında veri sorumlusu (Damla Peker), iletişim
  adresi (asklunami@gmail.com), toplanan veriler, amaç, hukuki sebep, aktarım, saklama süreleri ve
  KVKK md. 11 hakları var.

**Eksikler:**
- **Veriler webhook.site'a gidiyor.** Burası bir test servisi: veriler yurt dışında tutuluyor ve adresi
  bilen herkes gelen istekleri görebiliyor. Gerçek kullanıcı verisi toplamadan önce hedef, kontrol
  sizde olan bir yere taşınmalı (e-posta servisi, Google Sheets, veritabanı vb.).
- **Saklama süreleri elle uygulanmalı.** Politikadaki 1 yıl / 6 ay sürelerini otomatik silen bir
  mekanizma yok.
- **Hukuki inceleme yapılmadı.** Politika metni yayına alınmadan önce bir hukukçu tarafından
  gözden geçirilmedi.

## 6. HTTPS ✅

- `http://astrodamy.vercel.app/` → `308 Permanent Redirect` → `https://`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- Sunucudan webhook'a giden istek de HTTPS üzerinden gidiyor.

### 6a. Güvenlik başlıkları (ek madde) ⚠️

Canlı yanıtta `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy` başlıkları yok. Örneğin site başka bir sayfaya iframe ile gömülebiliyor
(clickjacking). **Öneri:** `vercel.json` içinde `headers` ile eklemek. CSP canlıda denenerek eklenmeli.

## 7. Hata mesajlarında iç bilgi sızmaması ✅

- Kullanıcıya dönen mesajlar genel ve Türkçe; webhook adresi, yanıt kodu ya da hata ayrıntısı içermiyor:
  - 500: "Sunucu yapılandırması eksik…"
  - 502: "Talebin iletilirken bir sorun oluştu…"
- Ayrıntılar (webhook yanıt kodu, hata yığını) yalnızca `console.error` ile Vercel loglarına gidiyor.
- Düzeltmeden önceki 500 çöküşünde bile Vercel'in genel hata sayfası dönüyordu
  (`FUNCTION_INVOCATION_FAILED` + istek kimliği); kod ya da yığın sızmıyordu.
- Bilinmeyen API yolları Vercel'in genel 404 sayfasını döndürüyor.

## 8. Bağımlılık güvenliği / `npm audit` ✅

- `npm audit` → **0 vulnerabilities** (hem tüm bağımlılıklar hem `--omit=dev`).
- Doğrudan bağımlılıklar: `react` / `react-dom` 19.3.0, `@vercel/functions` 3.9.9, `vite` 7.3.6,
  `@vitejs/plugin-react` 5.2.0.
- `npm outdated`: `vite` 8 ve `@vitejs/plugin-react` 6 major sürümleri çıkmış. Güvenlik açığı değil;
  ayrı bir güncelleme olarak ele alınabilir.
- `package-lock.json` repoda; Vercel build'i aynı sürümleri kuruyor.
