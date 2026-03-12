import { DocsShell } from '@/components/docs-shell';

const intakeFields = [
  'Demografi ve treating institution',
  'Primary / recurrent ayrimi',
  'Tumor side, location, longitudinal segment',
  'Histology, grade, size, depth, metastasis',
  'Treatment intent, surgery, margin ve contamination',
];

export default function IntakeWorkspacePage() {
  return (
    <DocsShell
      eyebrow="Patient intake"
      title="Staging + pathology + treatment fields"
      description="Bu alan, hasta veri giris modelinin web tanitim yuzudur. Ama amac hasta alani ve veri yapisini acik gostermek."
      sideTitle="Intake Workspace"
      sideItems={intakeFields}
      sideNote="Gercek klinik veri girisi su an mobil uygulama tarafinda tutuluyor. Web yuzeyi ise alan yapisini, kapsamı ve onboarding akisini aciklar."
    >
      <article className="panel-card docs-content-card docs-rich-text">
        <h3>Kayit mantigi</h3>
        <p>Hasta intake modeli minimal dataset mantigiyla kuruldu. Demografi, lokalizasyon, histoloji, grade ve tedavi niyeti gibi alanlar tek bir klinik cekirdekte toplanir.</p>
        <h3>Veri kapsamı</h3>
        <ul className="panel-list">
          {intakeFields.map((field) => (
            <li key={field}>{field}</li>
          ))}
        </ul>
        <h3>Kullanici yonlendirmesi</h3>
        <p>Landing uzerindeki bu kart artik pasif preview degil. Kullanici burada hangi bilgi alanlarinin toplandigini ve klinik akisin nasil kurgulandigini gorebilir.</p>
      </article>
    </DocsShell>
  );
}
