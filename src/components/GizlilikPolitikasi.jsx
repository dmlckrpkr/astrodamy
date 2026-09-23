// KVKK (6698 sayılı Kanun) aydınlatma metni taslağı. Köşeli parantezli alanlar doldurulmalı.
const ILETISIM_EPOSTA = '[iletişim e-posta adresi]'

export default function GizlilikPolitikasi() {
  return (
    <section className="gizlilik">
      <h2>Gizlilik Politikası</h2>
      <p className="alt-baslik">Kişisel Verilerin Korunması ve İşlenmesi Hakkında Aydınlatma Metni</p>
      <p className="guncelleme">Son güncelleme: 22 Eylül 2026</p>

      <h3>1. Veri sorumlusu</h3>
      <p>
        Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında veri sorumlusu
        sıfatıyla AstroDamy ([ad soyad]) tarafından hazırlanmıştır. AstroDamy, astroloji içerikleri ve
        birebir online danışmanlık sunan tek kişilik bir dijital hizmettir.
      </p>

      <h3>2. Toplanan kişisel veriler</h3>
      <p>Sitedeki formları doldurduğunda yalnızca şu verileri topluyoruz:</p>
      <ul>
        <li><strong>Ad soyad:</strong> danışmanlık talebi ve kontenjan bildirimi formlarında</li>
        <li><strong>E-posta adresi:</strong> danışmanlık talebi ve kontenjan bildirimi formlarında</li>
        <li><strong>Telefon numarası:</strong> yalnızca danışmanlık talebi formunda</li>
      </ul>
      <p>
        Bunlara ek olarak ilgilendiğin danışmanlık paketi, açık rıza verdiğin tarih ve saat ile kötüye
        kullanımı önlemek amacıyla IP adresin geçici olarak işlenir.
      </p>

      <h3>3. Verilerin işlenme amacı</h3>
      <ul>
        <li>Danışmanlık talebine dönüş yapmak ve seans planlamak</li>
        <li>Kontenjanı dolu bir paket yeniden açıldığında seni bilgilendirmek</li>
        <li>Formların kötüye kullanımını ve aşırı istekleri engellemek</li>
      </ul>
      <p>
        Verilerin bu amaçlar dışında kullanılmaz, pazarlama listelerine eklenmez ve satılmaz.
      </p>

      <h3>4. Hukuki sebep ve toplama yöntemi</h3>
      <p>
        Verilerin, sitedeki formlar aracılığıyla elektronik ortamda ve KVKK’nın 5. maddesi uyarınca
        açık rızana dayanılarak toplanır. Açık rıza vermeden form gönderilemez.
      </p>

      <h3>5. Verilerin aktarılması</h3>
      <p>
        Form verileri, sitenin barındırıldığı ve talepleri bize ileten altyapı hizmet sağlayıcılarının
        sunucuları üzerinden işlenir. Bu sunucular yurt dışında bulunabilir. Verilerin, bu hizmetlerin
        sağlanması için gereken ölçüde ve KVKK’nın 9. maddesine uygun olarak aktarılır. Yasal bir
        zorunluluk olmadıkça üçüncü kişilerle paylaşılmaz.
      </p>

      <h3>6. Saklama süresi</h3>
      <ul>
        <li>
          <strong>Danışmanlık talepleri:</strong> seans tamamlandıktan ya da talep sonuçlandıktan sonra
          en fazla 1 yıl
        </li>
        <li>
          <strong>Kontenjan bildirimleri:</strong> bildirim gönderildikten sonra ya da en geç kayıttan
          itibaren 6 ay
        </li>
        <li><strong>IP adresi (istek sınırlama):</strong> en fazla 1 dakika</li>
      </ul>
      <p>Süre dolduğunda verilerin silinir veya anonim hale getirilir.</p>

      <h3>7. Hakların</h3>
      <p>KVKK’nın 11. maddesi uyarınca şu haklara sahipsin:</p>
      <ul>
        <li>Kişisel verilerinin işlenip işlenmediğini öğrenmek</li>
        <li>İşlenmişse buna ilişkin bilgi talep etmek</li>
        <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenmek</li>
        <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilmek</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini istemek</li>
        <li>Silinmesini veya yok edilmesini istemek</li>
        <li>Düzeltme ve silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini istemek</li>
        <li>
          Yalnızca otomatik sistemlerle analiz edilmesi sonucu aleyhine bir sonuç çıkmasına itiraz
          etmek
        </li>
        <li>Kanuna aykırı işlenmesi nedeniyle zarara uğrarsan zararın giderilmesini talep etmek</li>
      </ul>
      <p>Açık rızanı dilediğin zaman geri alabilirsin. Geri alma, önceki işlemleri etkilemez.</p>

      <h3>8. İletişim</h3>
      <p>
        Haklarını kullanmak veya sorularını iletmek için{' '}
        <strong>{ILETISIM_EPOSTA}</strong> adresine yazabilirsin. Başvurularını en geç 30 gün içinde
        ücretsiz olarak yanıtlarız.
      </p>
    </section>
  )
}
