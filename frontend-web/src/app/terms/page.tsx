import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="doc-page">
      <div className="doc-shell">
        <Link href="/" className="doc-back">TumorArchives ana sayfa</Link>
        <article className="doc-card">
          <div className="eyebrow">Kosullar</div>
          <h1>Kullanim Kosullari</h1>
          <p className="doc-muted">Son guncelleme: 12 Mart 2026</p>
          <p>TumorArchives; klinik kayit, takip ve arastirma hazirligi icin gelistirilen bir yazilim urunudur. Yerel mevzuat, etik kurul ve kurum politikalarina uygun kullanim kullanicinin sorumlulugundadir.</p>
          <h2>Lisans modeli</h2>
          <ul className="panel-list">
            <li>Standart lisans en fazla 3 aktif cihaz icin tasarlanir.</li>
            <li>ORCID dogrulamasi ile akademik kullanim kurali genisler.</li>
            <li>ORCID yoksa 7 gunluk deneme uygulanir.</li>
          </ul>
          <h2>Offline kullanim</h2>
          <p>Uygulama son dogrulamadan sonra 30 gune kadar offline calisabilir. Bu sure sonunda yeni lisans dogrulamasi gerekebilir.</p>
          <h2>Klinik sorumluluk</h2>
          <p>Yazilim klinik karari tek basina belirlemez. Veri girisi, yorum ve nihai karar klinik ekibin sorumlulugundadir.</p>
        </article>
      </div>
    </main>
  );
}
