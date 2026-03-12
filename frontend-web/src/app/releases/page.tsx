import { DocsShell } from '@/components/docs-shell';

const items = [
  {
    version: 'v0.5',
    title: 'Platform shell redesign',
    points: [
      'Landing, auth ve panel ayni tasarim sistemine cekildi',
      'Digital tool directory mantiginda moduler web duzeni kuruldu',
      'Contact, privacy, terms ve releases sayfalari yeni shell ile hizalandi',
    ],
  },
  {
    version: 'v0.4',
    title: 'Next.js landing + auth + panel iskeleti',
    points: [
      'Landing ana sayfasi frontend-web icine tasindi',
      'Login, register, forgot-password, devices ve license rotalari eklendi',
      'Trial to ORCID academic lisans akisi eklendi',
    ],
  },
  {
    version: 'v0.3',
    title: 'Landing aktif kullanim paketi',
    points: [
      'Erken erisim, ORCID, deneme ve lisans CTA hedefleri eklendi',
      'Gizlilik, kullanim kosullari ve iletisim sayfalari tanimlandi',
    ],
  },
];

export default function ReleasesPage() {
  return (
    <DocsShell
      eyebrow="Surum Notlari"
      title="Web, auth ve panel katmaninin evrimi"
      description="Bu sayfa landing ve panel tarafinda yapilan ana urun degisikliklerini toparlar. Teknik akislar ile urun dili arasindaki hizalama burada izlenebilir."
      sideTitle="Release Ozetleri"
      sideItems={[
        'Landing tasarim guncellemeleri',
        'Auth ve lisans akis degisiklikleri',
        'Panel ve inbox genislemeleri',
        'Dokuman ve policy sayfasi hizalamasi',
      ]}
      sideNote="Release notlari teknik teslimleri ve urun dilini ayni takvimde gormek icin tutuluyor."
    >
      <article className="panel-card docs-content-card">
        <div className="release-stack">
          {items.map((item) => (
            <section key={item.version} className="release-item">
              <span className="plan-tag">{item.version}</span>
              <h3>{item.title}</h3>
              <ul className="panel-list">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>
    </DocsShell>
  );
}
