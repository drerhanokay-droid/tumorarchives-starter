import Link from 'next/link';

const items = [
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
    <main className="doc-page">
      <div className="doc-shell">
        <Link href="/" className="doc-back">TumorArchives ana sayfa</Link>
        <article className="doc-card">
          <div className="eyebrow">Surum Notlari</div>
          <h1>Web ve urun notlari</h1>
          <div className="release-stack">
            {items.map((item) => (
              <section key={item.version} className="release-item">
                <span className="plan-tag">{item.version}</span>
                <h2>{item.title}</h2>
                <ul className="panel-list">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
