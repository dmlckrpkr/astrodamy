// Danışmanlık paketleri — ödevdeki "ürünler". productId'ler CLAUDE.md tablosuyla aynı.
// "Stokta yok" = kontenjan dolu (musait: false).
// Webhook payload'larında: productId → productId, ad → productName.
// kategori: danışmanlık bölümündeki filtre butonları için (bkz. kategoriler).

export const kategoriler = [
  { id: 'tumu', ad: 'Tümü' },
  { id: 'harita', ad: 'Harita' },
  { id: 'sayilar', ad: 'Sayılar' },
  { id: 'iliski', ad: 'İlişki' },
]

export const products = [
  {
    productId: 'dogum-haritasi',
    kategori: 'harita',
    ikon: '🌙',
    ad: 'Doğum Haritası Analizi',
    fiyat: 1200,
    sure: 60,
    musait: true,
    aciklama: 'Güneş, Ay, yükselen ve gezegen yerleşimlerinle kişiliğini, potansiyelini ve hayat temalarını birlikte okuyalım.',
  },
  {
    productId: 'numeroloji',
    kategori: 'sayilar',
    ikon: '🔢',
    ad: 'Numeroloji Okuması',
    fiyat: 800,
    sure: 45,
    musait: true,
    aciklama: 'Yaşam yolu sayın, karmik sayıların ve kişisel yıl döngün üzerinden bu dönemin anlamını keşfet.',
  },
  {
    productId: 'sinastri',
    kategori: 'iliski',
    ikon: '💞',
    ad: 'Sinastri (İlişki Uyumu)',
    fiyat: 1500,
    sure: 75,
    musait: false,
    aciklama: 'İki doğum haritasını karşılaştırarak ilişkinizin güçlü yanlarını ve dikkat edilmesi gereken noktaları inceleyelim.',
  },
]

export const getProductById = (productId) =>
  products.find((product) => product.productId === productId)
