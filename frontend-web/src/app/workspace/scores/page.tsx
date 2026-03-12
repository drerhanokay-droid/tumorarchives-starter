import { DocsShell } from '@/components/docs-shell';

const scoreItems = [
  '31 dogrulanmis skorlama sistemi',
  '378 siniflama sistemi',
  'Uzmanlik bazli kategoriler',
  'Klinik standardizasyon ve arastirma uyumu',
];

export default function ScoresWorkspacePage() {
  return (
    <DocsShell
      eyebrow="Decision support"
      title="Skor ve Siniflama Kutuphanesi"
      description="Bu alan standardize klinik veri girisini destekleyen skor ve siniflama kutuphanesinin kapsamını aciklar."
      sideTitle="Scores Workspace"
      sideItems={scoreItems}
      sideNote="Bu kutuphane landing&apos;de pasif tanitim karti olmaktan cikti; artik hangi karar destek katmaninin sunuldugu acik bir sayfaya baglaniyor."
    >
      <article className="panel-card docs-content-card docs-rich-text">
        <h3>Kapsam</h3>
        <p>Skor ve siniflama modulu, klinik kaydi serbest metin duzensizliginden cikarip yapisal alanlara tasir. Boylece takip, arastirma ve multicenter veri karsilastirmasi daha guvenilir hale gelir.</p>
        <ul className="panel-list">
          {scoreItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>Kullanım amacı</h3>
        <p>Bu sayfa bilgi yuzeyidir; gercek klinik secimler ve veri baglama akisi mobil taraftaki hasta ve follow-up workflow&apos;unda islenir.</p>
      </article>
    </DocsShell>
  );
}
