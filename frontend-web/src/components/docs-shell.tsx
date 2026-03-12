import Link from 'next/link';
import type { ReactNode } from 'react';

type DocsShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  sideTitle: string;
  sideItems: string[];
  sideNote?: string;
  children: ReactNode;
};

export function DocsShell({
  eyebrow,
  title,
  description,
  sideTitle,
  sideItems,
  sideNote,
  children,
}: DocsShellProps) {
  return (
    <main className="workspace-shell workspace-shell-docs">
      <header className="workspace-nav">
        <Link href="/" className="platform-brand">
          <span className="brand-badge">TA</span>
          <div>
            <strong>TumorArchives</strong>
            <p>Bilgilendirme, basvuru ve urun notlari</p>
          </div>
        </Link>
        <div className="platform-links">
          <Link href="/">Landing</Link>
          <Link href="/login">Giris</Link>
          <Link href="/contact">Basvuru</Link>
        </div>
      </header>

      <section className="workspace-grid docs-layout-grid">
        <article className="workspace-intro-card">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>

          <div className="workspace-side-section">
            <div className="workspace-section-kicker">Bu sayfada</div>
            <ul className="panel-list docs-side-list">
              {sideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {sideNote ? <p className="docs-side-note">{sideNote}</p> : null}

          <div className="workspace-footer-links">
            <Link href="/privacy">Gizlilik</Link>
            <Link href="/terms">Kosullar</Link>
            <Link href="/releases">Surum Notlari</Link>
          </div>
        </article>

        <section className="workspace-main-stack docs-main-stack">
          <div className="workspace-page-head">
            <div className="workspace-section-kicker">{sideTitle}</div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {children}
        </section>
      </section>
    </main>
  );
}
