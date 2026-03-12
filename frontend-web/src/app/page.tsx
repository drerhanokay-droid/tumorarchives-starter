import Image from 'next/image';
import Link from 'next/link';
import { getHealth } from '@/lib/api';

const categories = [
  { label: 'Hasta Kaydi', href: '/workspace/intake' },
  { label: 'Radyoloji', href: '/workspace/radiology' },
  { label: 'Follow-up', href: '/workspace/follow-up' },
  { label: 'Skorlar', href: '/workspace/scores' },
  { label: 'Export', href: '/workspace/export' },
  { label: 'Lisans', href: '/panel/license' },
];

const modules = [
  {
    title: 'Hasta Kaydi Workspace',
    description: 'Demografi, staging, patoloji ve tedavi alanlarini tek veri modeli icinde tutar.',
    action: { href: '/workspace/intake', label: 'Kayit Akisini Incele' },
    meta: 'Clinical core',
  },
  {
    title: 'Radyoloji Domain Arsivi',
    description: 'Preop ve postop MRI, BT, radyografi ve takip serilerini hasta bazli yonetir.',
    action: { href: '/workspace/radiology', label: 'Goruntu Alanini Ac' },
    meta: 'Imaging',
  },
  {
    title: 'Follow-up Timeline',
    description: 'NED, AWD, DOD, tedavi plani ve kontrol onerilerini zaman cizgisi uzerinde gosterir.',
    action: { href: '/workspace/follow-up', label: 'Timeline Alanini Ac' },
    meta: 'Outcome tracking',
  },
  {
    title: 'Skor ve Siniflama Kutuphanesi',
    description: '31 skor ve 378 siniflama sistemiyle standardize klinik kayit olusturur.',
    action: { href: '/workspace/scores', label: 'Kutuphane Alanini Ac' },
    meta: 'Decision support',
  },
  {
    title: 'Anonim Export Engine',
    description: 'Excel, CSV ve JSON ciktilarinda kisisel alanlari otomatik anonimlestirir.',
    action: { href: '/workspace/export', label: 'Export Alanini Ac' },
    meta: 'Research',
  },
  {
    title: 'Lisans ve Cihaz Paneli',
    description: 'Trial, academic, institution ve cihaz limiti kurallarini web panelinden yonetir.',
    action: { href: '/panel/license', label: 'Lisans Paneli' },
    meta: 'Operations',
  },
];

const panelCards = [
  { title: 'Auth', body: 'Kayit, giris, sifre sifirlama ve trial baslatma akisi' },
  { title: 'License', body: 'ORCID, trial ve institution kurallarinin yonetimi' },
  { title: 'Devices', body: 'Aktif cihazlar, limitler ve cihaz degistirme akisi' },
  { title: 'Inbox', body: 'Erken erisim, pilot ve kurum taleplerinin takibi' },
];

const faqs = [
  {
    q: 'Hasta verilerim sunucuya aktariliyor mu?',
    a: 'Hayir. Hasta verileri yalnizca cihazda sifrelenmis lokal veri tabaninda kalir. Sunucu sadece auth, lisans ve cihaz kaydi icin kullanilir.',
  },
  {
    q: 'Sifremi unutursam verilerimi kaybeder miyim?',
    a: 'Hayir. Kurtarma akisi auth katmanini sifirlar; lokal veri anahtari modeli ayri oldugu icin cihazdaki arsiv korunur.',
  },
  {
    q: 'Internet olmadiginda uygulama calisir mi?',
    a: 'Evet. Son lisans dogrulamasindan sonra offline pencere ile klinik kullanim kesintisiz devam eder.',
  },
  {
    q: 'Verileri arastirma icin nasil disa aktaririm?',
    a: 'Arastirma modulunde Excel, CSV ve JSON ciktilari alinir. Disa aktarim sirasinda kimlik alanlari anonimlestirilir.',
  },
];

const quickStats = [
  { value: '31', label: 'skorlama sistemi' },
  { value: '378', label: 'siniflama sistemi' },
  { value: '3', label: 'standart cihaz limiti' },
  { value: '30 gun', label: 'offline pencere' },
];

const mockupSteps = [
  { label: 'Patient intake', value: 'Staging + pathology + treatment fields', href: '/workspace/intake' },
  { label: 'Radiology stack', value: 'MRI, BT, radyografi, DICOM seri gruplari', href: '/workspace/radiology' },
  { label: 'Outcome loop', value: 'NED / AWD / DOD + timeline + control dates', href: '/workspace/follow-up' },
];

const mockupTiles = [
  { title: 'Lisans durumu', value: 'Trial -> Academic', tone: 'blue', href: '/panel/license' },
  { title: 'Aktif cihazlar', value: '2 / 3', tone: 'teal', href: '/panel/devices' },
  { title: 'Follow-up engine', value: 'Timeline live', tone: 'amber', href: '/workspace/follow-up' },
  { title: 'Export', value: 'Excel / CSV / JSON', tone: 'rose', href: '/workspace/export' },
];

export default async function Home() {
  let health: { status: string; service?: string; note?: string };

  try {
    health = await getHealth();
  } catch {
    health = {
      status: 'degraded',
      service: 'tumorarchives-license',
      note: 'Backend health verisi gecici olarak alinamadi. Landing fallback modunda render edildi.',
    };
  }

  return (
    <main className="platform-home">
      <header className="platform-nav">
        <div className="platform-brand">
          <span className="brand-badge">TA</span>
          <div>
            <strong>TumorArchives</strong>
            <p>Oncology archive platform</p>
          </div>
        </div>
        <nav className="platform-links">
          <a href="#modules">Moduller</a>
          <a href="#security">Guvenlik</a>
          <a href="#panel">Panel</a>
          <a href="#faq">SSS</a>
          <Link href="/login" className="button primary small">Giris Yap</Link>
        </nav>
      </header>

      <section className="platform-hero">
        <div className="hero-main">
          <span className="eyebrow">Device-first musculoskeletal oncology platform</span>
          <h1>Hasta arsivi, radyoloji ve follow-up organizasyonunu bir platform arayuzunde toplayin</h1>
          <p className="hero-text">
            Bu arayuz, klasik landing mantigindan cikiyor ve urunun modullerini bir platform katalogu gibi sunuyor:
            klinik kayit, radyoloji domainleri, timeline, lisans yonetimi ve arastirma exportu tek bilgi mimarisinde toplaniyor.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="button primary">Erken Erisim</Link>
            <Link href="/contact" className="button secondary">Demo Talebi</Link>
          </div>
          <div className="category-strip">
            {categories.map((category) => (
              <Link key={category.label} href={category.href} className="category-pill">{category.label}</Link>
            ))}
          </div>
        </div>

        <aside className="hero-aside">
          <div className="aside-panel product-mockup-panel">
            <div className="aside-heading">
              <span>Workspace preview</span>
              <strong>Klinik + operasyon catisi</strong>
            </div>
            <div className="mockup-frame">
              <Image
                src="/platform-preview.svg"
                alt="TumorArchives workspace preview"
                width={1280}
                height={860}
                className="mockup-image"
                priority
              />
            </div>
            <div className="mockup-caption-grid">
              {mockupSteps.map((step) => (
                <Link key={step.label} href={step.href} className="mockup-step mockup-step-link">
                  <strong>{step.label}</strong>
                  <span>{step.value}</span>
                </Link>
              ))}
            </div>
            <div className="mockup-grid">
              {mockupTiles.map((tile) => (
                <Link key={tile.title} href={tile.href} className={`mockup-tile mockup-${tile.tone} mockup-tile-link`}>
                  <span>{tile.title}</span>
                  <strong>{tile.value}</strong>
                </Link>
              ))}
            </div>
          </div>
          <div className="aside-panel health-panel">
            <div className="aside-heading">
              <span>Platform state</span>
              <strong>Health Snapshot</strong>
            </div>
            <pre>{JSON.stringify(health, null, 2)}</pre>
          </div>
          <div className="stats-grid-platform">
            {quickStats.map((stat) => (
              <article key={stat.label} className="stat-tile-platform">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="module-section" id="modules">
        <div className="section-header-platform">
          <span className="eyebrow">Module catalog</span>
          <h2>Platform modullerini arac dizini netliginde sun</h2>
          <p>
            Digital tool dizinlerindeki organizasyon mantigi burada urun katmanlarina uygulandi: net baslik, kisa aciklama, tek aksiyon.
          </p>
        </div>
        <div className="module-grid">
          {modules.map((module) => (
            <Link key={module.title} href={module.action.href} className="module-card module-card-link">
              <span className="module-meta">{module.meta}</span>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <span className="module-link">{module.action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="security-band" id="security">
        <div className="security-copy">
          <span className="eyebrow">Security model</span>
          <h2>Sunucuda hasta verisi yok, web katmani sadece yonetim icin var</h2>
          <p>
            Landing mesajlari urun mimarisiyle birebir uyumlu: lokal sifreli veri modeli, auth ve lisansin ayrik tutulmasi, offline pencere ve cihaz yonetimi.
          </p>
        </div>
        <div className="security-checks">
          <article>
            <strong>Local-first archive</strong>
            <p>Hasta kaydi, goruntuler ve timeline verisi cihazda kalir.</p>
          </article>
          <article>
            <strong>Recovery-aware auth</strong>
            <p>Sifre sifirlama auth katmanini etkiler, lokal arsiv modelini degil.</p>
          </article>
          <article>
            <strong>Offline continuity</strong>
            <p>Son dogrulama sonrasi belirli sure internet olmadan kullanim devam eder.</p>
          </article>
        </div>
      </section>

      <section className="panel-section" id="panel">
        <div className="section-header-platform">
          <span className="eyebrow">Web panel</span>
          <h2>Landing, auth ve operations paneli ayni organizasyon dilini kullanir</h2>
        </div>
        <div className="panel-card-grid">
          {panelCards.map((card) => (
            <article key={card.title} className="panel-info-card">
              <span>{card.title}</span>
              <strong>{card.body}</strong>
            </article>
          ))}
        </div>
        <div className="panel-actions-row">
          <Link href="/login" className="button primary">Paneli Ac</Link>
          <Link href="/panel/license" className="button secondary">License</Link>
          <Link href="/panel/devices" className="button secondary">Devices</Link>
          <Link href="/panel/inbox" className="button secondary">Inbox</Link>
        </div>
      </section>

      <section className="faq-section-platform" id="faq">
        <div className="section-header-platform">
          <span className="eyebrow">FAQ</span>
          <h2>Kritik vaatler sade ve savunulabilir kalmali</h2>
        </div>
        <div className="faq-grid-platform">
          {faqs.map((item) => (
            <article key={item.q} className="faq-tile-platform">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bottom-cta">
        <div>
          <span className="eyebrow">Deployment path</span>
          <h2>TumorArchives&apos;i pilot kullanim seviyesine tasiyin</h2>
          <p>Kayit ol, trial baslat, paneli ac ve cihaz kurallarini yonet.</p>
        </div>
        <div className="hero-actions">
          <Link href="/register" className="button primary">Kayit Ol</Link>
          <Link href="/login" className="button secondary">Giris Yap</Link>
        </div>
      </section>

      <footer className="site-footer platform-footer">
        <Link href="/privacy">Gizlilik</Link>
        <Link href="/terms">Kosullar</Link>
        <Link href="/contact">Iletisim</Link>
        <Link href="/releases">Surum Notlari</Link>
      </footer>
    </main>
  );
}
