import { DocsShell } from '@/components/docs-shell';

export default function PrivacyPage() {
  return (
    <DocsShell
      eyebrow="Gizlilik"
      title="Hasta verisi sunucuda degil, cihazda kalir"
      description="TumorArchives urun modeli klinik veriyi auth ve lisans katmanindan ayirir. Sunucuya yalnizca hesap, lisans ve cihaz yonetimiyle ilgili veriler gider."
      sideTitle="Politika Ozeti"
      sideItems={[
        'Kimlik dogrulama verileri',
        'Lisans ve cihaz kayitlari',
        'ORCID durumu ve sifre kurtarma akisleri',
        'Anonimlestirilmis export mantigi',
      ]}
      sideNote="Yerel klinik verinin korunmasi urun vaadinin merkezidir; web katmani bunu ihlal etmez."
    >
      <article className="panel-card docs-content-card docs-rich-text">
        <p className="docs-updated">Son guncelleme: 12 Mart 2026</p>
        <p>TumorArchives urun modelinde hasta verileri sunucuya aktarilmaz. Hasta kimligi, klinik notlar, goruntuler ve takip verileri yalnizca cihaz uzerinde sifrelenmis yerel veri tabaninda tutulur.</p>
        <h3>Sunucuda tutulan veriler</h3>
        <ul className="panel-list">
          <li>Kimlik dogrulama verileri</li>
          <li>Lisans ve cihaz sayisi</li>
          <li>ORCID durumu</li>
          <li>Sifre kurtarma akis kayitlari</li>
        </ul>
        <h3>Yerel veri modeli</h3>
        <p>Hasta verileri cihaz ici sifreleme mantigi ile korunur. Sunucu; hasta kimlikleri, klinik detaylar veya goruntu arsivine erismez.</p>
        <h3>Arastirma exportu</h3>
        <p>Excel, CSV ve JSON exportlarinda kisisel tanimlayicilar otomatik olarak dataset disinda birakilir veya anonimlestirilir.</p>
      </article>
    </DocsShell>
  );
}
