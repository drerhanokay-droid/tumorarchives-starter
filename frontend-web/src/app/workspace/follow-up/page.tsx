import { DocsShell } from '@/components/docs-shell';

const followUpItems = [
  'NED / AWD / DOD durum takibi',
  'Treatment plan secimi',
  'Tumor board yorumlari',
  'Kontrol tarihi onerisi',
  'Radyoloji serisi ile follow-up eslestirme',
];

export default function FollowUpWorkspacePage() {
  return (
    <DocsShell
      eyebrow="Outcome loop"
      title="NED / AWD / DOD + timeline + control dates"
      description="Follow-up workspace hastanin zaman icindeki onkolojik durumunu, planini ve bir sonraki kontrol mantigini tek timeline uzerinde toplar."
      sideTitle="Follow-up Workspace"
      sideItems={followUpItems}
      sideNote="Bu sayfa bilgi yuzeyidir; esas timeline veri girisi mobil klinik workspace icinde yapilir."
    >
      <article className="panel-card docs-content-card docs-rich-text">
        <h3>Timeline mantigi</h3>
        <p>Her kontrol NED, AWD veya DOD durumuyla kaydedilir. Buna treatment plan ve tumor board notu eklenerek cerrahi-sonrasi izlem daha sistematik hale gelir.</p>
        <h3>Otomatik kontrol onerisi</h3>
        <p>Plan tipine gore bir sonraki kontrol tarihi onerilir. Boylece takip akisi daimi ve hatirlatici bir cizgide kalir.</p>
        <h3>Bagli veri alanlari</h3>
        <ul className="panel-list">
          {followUpItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </DocsShell>
  );
}
