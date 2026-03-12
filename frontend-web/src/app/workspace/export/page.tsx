import { DocsShell } from '@/components/docs-shell';

const exportItems = [
  'Excel, CSV ve JSON ciktilari',
  'Anonimlestirilmis veri modeli',
  'Arastirma odakli alan secimi',
  'Hasta kimligi yerine dataset guvenligi',
];

export default function ExportWorkspacePage() {
  return (
    <DocsShell
      eyebrow="Export"
      title="Excel / CSV / JSON"
      description="Export engine klinik kaydi oldugu gibi degil, arastirma odakli ve anonimlestirilmis dataset mantigiyla disa aktarir."
      sideTitle="Export Workspace"
      sideItems={exportItems}
      sideNote="Landing karti artik dogrudan export mantigini anlatan bu alana aciliyor; kullanici preview ile gercek modulu karistirmiyor."
    >
      <article className="panel-card docs-content-card docs-rich-text">
        <h3>Arastirma ciktilari</h3>
        <p>Veriler Excel, CSV ve JSON formatinda alinabilir. Disa aktarim sirasinda kisisel alanlar otomatik olarak ayiklanir veya anonimlestirilir.</p>
        <h3>Kullanım amacı</h3>
        <p>Bu alan, multicenter arastirma ve yayin hazirligi icin tasarlandi. Ham klinik kaydi degil, temiz ve paylasilabilir ciktiyi hedefler.</p>
        <ul className="panel-list">
          {exportItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </DocsShell>
  );
}
