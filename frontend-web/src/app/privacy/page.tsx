import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="doc-page">
      <div className="doc-shell">
        <Link href="/" className="doc-back">TumorArchives ana sayfa</Link>
        <article className="doc-card">
          <div className="eyebrow">Gizlilik</div>
          <h1>Gizlilik Politikasi</h1>
          <p className="doc-muted">Son guncelleme: 12 Mart 2026</p>
          <p>TumorArchives urun modelinde hasta verileri sunucuya aktarilmaz. Hasta kimligi, klinik notlar, goruntuler ve takip verileri yalnizca cihaz uzerinde sifrelenmis yerel veri tabaninda tutulur.</p>
          <h2>Sunucuda tutulan veriler</h2>
          <ul className="panel-list">
            <li>Kimlik dogrulama verileri</li>
            <li>Lisans ve cihaz sayisi</li>
            <li>ORCID durumu</li>
            <li>Sifre kurtarma akis kayitlari</li>
          </ul>
          <h2>Yerel veri modeli</h2>
          <p>Hasta verileri cihaz ici sifreleme mantigi ile korunur. Sunucu; hasta kimlikleri, klinik detaylar veya goruntu arsivine erismez.</p>
          <h2>Arastirma exportu</h2>
          <p>Excel, CSV ve JSON exportlarinda kisisel tanimlayicilar otomatik olarak dataset disinda birakilir veya anonimlestirilir.</p>
        </article>
      </div>
    </main>
  );
}
