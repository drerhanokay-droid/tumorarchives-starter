'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { clearToken } from '@/lib/auth';

const primaryLinks = [
  { href: '/panel/license', label: 'Lisans' },
  { href: '/panel/devices', label: 'Cihazlar' },
  { href: '/panel/inbox', label: 'Inbox' },
];

const supportLinks = [
  { href: '/contact', label: 'Basvuru Formu' },
  { href: '/releases', label: 'Release Notlari' },
  { href: '/privacy', label: 'Gizlilik' },
];

const panelMetrics = [
  { label: 'Panel rol', value: 'Ops / admin' },
  { label: 'Veri modeli', value: 'Lisans + cihaz' },
  { label: 'Klinik veri', value: 'Sunucuda yok' },
];

export function PanelShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  function handleLogout() {
    clearToken();
    window.location.href = '/login';
  }

  return (
    <main className="workspace-shell workspace-shell-panel">
      <header className="workspace-nav">
        <Link href="/" className="platform-brand">
          <span className="brand-badge">TA</span>
          <div>
            <strong>TumorArchives</strong>
            <p>Web panel ve operasyon konsolu</p>
          </div>
        </Link>
        <div className="platform-links">
          <Link href="/">Landing</Link>
          <Link href="/login">Giris</Link>
          <button type="button" className="button secondary small" onClick={handleLogout}>
            Cikis
          </button>
        </div>
      </header>

      <section className="workspace-grid panel-layout-grid">
        <aside className="workspace-side-nav">
          <div className="workspace-side-section">
            <div className="workspace-section-kicker">Panel modulleri</div>
            <nav className="workspace-menu">
              {primaryLinks.map((link) => (
                <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="workspace-side-section">
            <div className="workspace-section-kicker">Destek</div>
            <nav className="workspace-menu workspace-menu-secondary">
              {supportLinks.map((link) => (
                <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="workspace-side-metrics">
            {panelMetrics.map((metric) => (
              <article key={metric.label} className="workspace-side-metric">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
        </aside>

        <section className="workspace-main-stack">
          <div className="workspace-page-head">
            <div className="eyebrow">Platform Paneli</div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {children}
        </section>
      </section>
    </main>
  );
}
