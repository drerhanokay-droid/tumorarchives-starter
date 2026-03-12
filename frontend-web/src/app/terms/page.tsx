import { DocsShell } from '@/components/docs-shell';

export default function TermsPage() {
  return (
    <DocsShell
      eyebrow="Kosullar"
      title="Lisans, offline kullanim ve klinik sorumluluk cercevesi"
      description="Bu sayfa urun kurallarini aciklar: cihaz kotasi, trial ve ORCID mantigi, offline pencere ve klinik sorumluluk sinirlari burada tanimlanir."
      sideTitle="Kullanim Kurallari"
      sideItems={[
        '3 cihazlik standart lisans modeli',
        '7 gunluk trial ve ORCID genislemesi',
        '30 gun offline kullanim penceresi',
        'Klinik karar sorumlulugu kullanicida',
      ]}
      sideNote="Bu yapi teknik mimariyle uyumlu kalacak sekilde yazildi; marketing dili ile backend gercegi ayni cizgide tutuluyor."
    >
      <article className="panel-card docs-content-card docs-rich-text">
        <p className="docs-updated">Son guncelleme: 12 Mart 2026</p>
        <p>TumorArchives; klinik kayit, takip ve arastirma hazirligi icin gelistirilen bir yazilim urunudur. Yerel mevzuat, etik kurul ve kurum politikalarina uygun kullanim kullanicinin sorumlulugundadir.</p>
        <h3>Lisans modeli</h3>
        <ul className="panel-list">
          <li>Standart lisans en fazla 3 aktif cihaz icin tasarlanir.</li>
          <li>ORCID dogrulamasi ile akademik kullanim kurali genisler.</li>
          <li>ORCID yoksa 7 gunluk deneme uygulanir.</li>
        </ul>
        <h3>Offline kullanim</h3>
        <p>Uygulama son dogrulamadan sonra 30 gune kadar offline calisabilir. Bu sure sonunda yeni lisans dogrulamasi gerekebilir.</p>
        <h3>Klinik sorumluluk</h3>
        <p>Yazilim klinik karari tek basina belirlemez. Veri girisi, yorum ve nihai karar klinik ekibin sorumlulugundadir.</p>
      </article>
    </DocsShell>
  );
}
