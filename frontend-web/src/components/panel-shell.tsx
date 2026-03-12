import Link from 'next/link';
import type { ReactNode } from 'react';

export function PanelShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="panel-page">
      <aside className="panel-sidebar">
        <Link href="/" className="panel-brand">TumorArchives</Link>
        <nav>
          <Link href="/login">Giris</Link>
          <Link href="/register">Kayit Ol</Link>
          <Link href="/forgot-password">Sifre Sifirla</Link>
          <Link href="/panel/license">Lisans Paneli</Link>
          <Link href="/panel/inbox">Basvuru Inbox</Link>
          <Link href="/panel/devices">Cihaz Paneli</Link>
        </nav>
      </aside>
      <section className="panel-content">
        <div className="panel-header">
          <div className="eyebrow">Web Panel</div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
