import Link from 'next/link';
import type { ReactNode } from 'react';

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="shell-page">
      <section className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="hero-points">
            <span>Hasta verisi sadece cihazda</span>
            <span>30 gun offline kullanim</span>
            <span>3 cihazlik standart lisans</span>
          </div>
        </div>
        <div className="auth-card">{children}</div>
      </section>
      <footer className="shell-footer">
        <Link href="/">Ana sayfa</Link>
        <Link href="/panel/license">Lisans</Link>
        <Link href="/panel/devices">Cihazlar</Link>
      </footer>
    </main>
  );
}
