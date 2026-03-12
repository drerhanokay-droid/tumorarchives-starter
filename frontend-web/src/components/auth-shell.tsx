import Link from 'next/link';
import type { ReactNode } from 'react';

const platformRules = [
  'Hasta verisi sadece cihazdaki sifreli veritabaninda kalir.',
  'Lisans ve cihaz yetkisi web katmanindan yonetilir.',
  'Offline kullanim penceresi son dogrulamadan sonra 30 gune kadar devam eder.',
];

const flowSteps = [
  'Hesap dogrula',
  'Lisans kurallarini yukle',
  'Cihaz yetkisini kontrol et',
  'Lokal arsivi cihazda ac',
];

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
    <main className="workspace-shell workspace-shell-auth">
      <header className="workspace-nav">
        <Link href="/" className="platform-brand">
          <span className="brand-badge">TA</span>
          <div>
            <strong>TumorArchives</strong>
            <p>Auth, lisans ve cihaz dogrulama kati</p>
          </div>
        </Link>
        <div className="platform-links">
          <Link href="/">Landing</Link>
          <Link href="/register">Kayit Ol</Link>
          <Link href="/contact">Erken Erisim</Link>
        </div>
      </header>

      <section className="workspace-grid auth-layout-grid">
        <article className="workspace-intro-card">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>

          <div className="workspace-rule-grid">
            {platformRules.map((rule) => (
              <section key={rule} className="workspace-rule">
                <strong>Kural</strong>
                <span>{rule}</span>
              </section>
            ))}
          </div>

          <div className="workspace-side-section">
            <div className="workspace-section-kicker">Cekirdek akis</div>
            <ol className="workspace-journey">
              {flowSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="workspace-footer-links">
            <Link href="/privacy">Gizlilik</Link>
            <Link href="/terms">Kosullar</Link>
            <Link href="/panel/license">Lisans Paneli</Link>
          </div>
        </article>

        <section className="workspace-form-card">
          <div className="workspace-card-head">
            <span className="workspace-section-kicker">Islem Konsolu</span>
            <h2>{eyebrow}</h2>
            <p>Bu panel sadece hesap ve yetki katmanini yonetir. Klinik kayitlar burada tutulmaz.</p>
          </div>
          {children}
        </section>
      </section>
    </main>
  );
}
