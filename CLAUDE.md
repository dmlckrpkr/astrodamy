# CLAUDE.md — AstroDamy

Bu dosya, AtölyeKart ödev serisinde AstroDamy projesi üzerinde çalışırken Claude'a
işletme bağlamını aktarır. Amaç: her konuşmada bu bilgileri baştan anlatmamak.

## İşletme Hakkında

- **Adı / hesap adı:** AstroDamy
- **Sektör:** Astroloji içerik üretimi ve kişisel danışmanlık (dijital hizmet)
- **Ölçek:** Tek kişilik, online çalışan bir danışman ve içerik üreticisi

Site iki işi birlikte yapıyor: ücretsiz günlük/aylık burç yorumlarıyla ziyaretçi çekmek,
ve bu ziyaretçileri ücretli birebir danışmanlık seanslarına yönlendirmek.

## Hedef Kitle

- Astrolojiye ilgi duyan, 20–45 yaş arası, çoğunlukla kadın kullanıcılar
- Instagram/TikTok'ta astroloji içeriği takip eden kitle
- Karar anlarında (kariyer, ilişki, taşınma) yön arayan kişiler
- Doğum haritası, numeroloji gibi konularda derinleşmek isteyen meraklılar

## İçerik ve Hizmet Kategorileri

1. **Günlük Burç Yorumları** — 12 burç, kısa ve pozitif tonlu (ücretsiz)
2. **Aylık Genel Yorum** — ayın enerjisi, aşk, iş/para başlıkları (ücretsiz)
3. **Danışmanlık Paketleri** — birebir online seanslar (ücretli)

## Danışmanlık Paketleri (projedeki "ürünler")

| productId | Paket | Fiyat | Süre | Durum |
|---|---|---|---|---|
| dogum-haritasi | Doğum Haritası Analizi | 1.200 ₺ | 60 dk | Müsait |
| numeroloji | Numeroloji Okuması | 800 ₺ | 45 dk | Müsait |
| sinastri | Sinastri (İlişki Uyumu) | 1.500 ₺ | 75 dk | Kontenjan dolu |

Ödevdeki "ürün" kavramı = danışmanlık paketi. "Stokta yok" = "kontenjan dolu".

## Ton ve Marka Sesi

- Sıcak, destekleyici, merak uyandıran; korkutucu veya kesin kehanet dili yok
- Tüm arayüz metinleri Türkçe, fiyatlar ₺
- Görsel dil: gece mavisi, altın, lavanta; zarif ve sade

## Proje Notları

- AtölyeKart Haftalık Ödev Serisi (6 hafta), Hafta 1 — senaryo AstroDamy olarak uyarlandı.
- Akış: önce statik HTML (`index.html`), sonra React.
- Planlanan webhook'lar: "Danışmanlık Talebi" (ödevdeki Sipariş Ver) ve
  "Kontenjan Açılınca Haber Ver" (ödevdeki Stok Bildirimi).
