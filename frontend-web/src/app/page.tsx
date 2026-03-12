import Link from 'next/link';
import { getHealth } from '@/lib/api';

const features = [
  {
    title: 'Cihaz ici sifreli arsiv',
    body: 'Hasta kayitlari, goruntuler ve timeline verisi sifrelenmis lokal veritabanda tutulur.',
  },
  {
    title: '31 skor / 378 siniflama',
    body: '11 uzmanlik kategorisinde yerlesik skor ve siniflama sistemi ile standardizasyon saglanir.',
  },
  {
    title: 'Anonim arastirma exportu',
    body: 'Excel, CSV ve JSON formatlarinda export alinir; kisisel alanlar otomatik anonimlestirilir.',
  },
  {
    title: '30 gun offline pencere',
    body: 'Son lisans dogrulamasindan sonra uygulama belirli bir sure internet olmadan calisabilir.',
  },
];

const faqs = [
  {
    q: 'Hasta verilerim sunucuya aktariliyor mu?',
    a: 'Hayir. Tum hasta verileri yalnizca cihazda, sifrelenmis yerel veri tabaninda saklanir. Sunucu sadece lisans ve kimlik dogrulama islemleri icin kullanilir.',
  },
  {
    q: 'Sifremi unutursam verilerimi kaybeder miyim?',
    a: 'Hayir. Bulut tabanli guvenli kurtarma mekanizmasi auth katmanini sifirlar; hasta verisi cihazda kalir.',
  },
  {
    q: 'Internet baglantisi olmadiginda uygulama calisir mi?',
    a: 'Evet. Uygulama son dogrulamadan sonra 30 gune kadar cevrimdisi kullanilabilir. Sure doldugunda yeniden dogrulama gerekir.',
  },
  {
    q: 'Uygulamayi kac cihazda kullanabilirim?',
    a: 'Standart lisans uc cihaza kadar kullanim saglar. Cihazlarinizi web paneli uzerinden yonetebilirsiniz.',
  },
  {
    q: 'ORCID dogrulamasi nedir ve neden gerekli?',
    a: 'ORCID, arastirmacilar icin dijital kimlik sistemidir. Dogrulama yapildiginda akademik lisans sureklilik kazanir. Dogrulama olmadan 7 gunluk deneme suresi uygulanir.',
  },
  {
    q: 'Verilerimi akademik arastirma icin nasil disa aktarabilirim?',
    a: 'Arastirma modulunden verilerinizi Excel, CSV veya JSON formatinda disa aktarabilirsiniz. Disa aktarim sirasinda kisisel bilgiler otomatik anonimlestirilir.',
  },
];

export default async function Home() {
  const data = await getHealth();

  return (
    <main className="landing-page">
      <nav className="site-nav">
        <Link href="/" className="site-brand">TumorArchives</Link>
        <div className="site-links">
          <a href="#features">Ozellikler</a>
          <a href="#security">Guvenlik</a>
          <a href="#faq">SSS</a>
          <Link href="/login" className="button primary small">Giris Yap</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy-block">
          <div className="eyebrow">ORCID dogrulamali akademik kullanim + cihaz oncelikli guven modeli</div>
          <h1>Klinik kayittan anonim arastirma cikisina tek akista ilerleyin</h1>
          <p className="hero-lead">
            TumorArchives; hasta kayitlari, goruntuler, follow-up timeline, skorlar ve anonim arastirma exportlarini tek akista birlestiren cihaz ici tumor arsividir.
            Hasta verisi sunucuda tutulmaz. Sunucu sadece auth, lisans ve cihaz yonetimi icin kullanilir.
          </p>
          <div className="marketing-actions">
            <Link href="/register" className="button primary">Erken Erisim Basvurusu</Link>
            <Link href="/panel/license" className="button secondary">Lisans Mantigini Incele</Link>
          </div>
          <div className="hero-points">
            <span>Hasta verisi sadece cihazda</span>
            <span>3 cihazlik standart lisans</span>
            <span>30 gun offline pencere</span>
          </div>
        </div>
        <div className="showcase-card">
          <div className="showcase-head">
            <span>TumorArchives</span>
            <strong>Sistem Durumu</strong>
          </div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <div className="showcase-list">
            <div><strong>Trial</strong><span>7 gun</span></div>
            <div><strong>Academic</strong><span>ORCID ile</span></div>
            <div><strong>Enterprise</strong><span>Kurum modeli</span></div>
          </div>
        </div>
      </section>

      <section className="trust-row">
        <article className="trust-card">
          <strong>Veri modeli</strong>
          <p>Hasta verisi cihazda sifreli tutulur. Sunucu sadece auth, lisans ve cihaz kaydini gorur.</p>
        </article>
        <article className="trust-card">
          <strong>Klinik akis</strong>
          <p>Hasta kaydi, timeline, skorlar ve goruntu arsivi ayni veri modeli uzerinde ilerler.</p>
        </article>
        <article className="trust-card">
          <strong>Arastirma</strong>
          <p>Excel, CSV ve JSON exportlarinda kisiler otomatik anonimlestirilir.</p>
        </article>
        <article className="trust-card">
          <strong>Panel</strong>
          <p>Web paneli cihaz limiti, ORCID ve sifre kurtarma akislarini yonetir.</p>
        </article>
      </section>

      <section className="content-section" id="features">
        <div className="section-heading">
          <div className="eyebrow">Ozellikler</div>
          <h2>Aktif kullanim icin gereken cekirdek urun katmanlari</h2>
          <p>Bu web sayfasi sadece giris degil; urunun teknik vaadini ve lisans mantigini da ayni yerde aciklar.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-box" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section split-section" id="security">
        <div className="security-panel">
          <div className="eyebrow">Guvenlik</div>
          <h2>Sunucuda hasta verisi yok, web katmaninda sadece yonetim var</h2>
          <ul className="panel-list">
            <li>SQLCipher ile lokal veritabani sifreleme</li>
            <li>Secure storage ile anahtar koruma</li>
            <li>Bulut tabanli auth ve sifre kurtarma</li>
            <li>Web paneli ile cihaz kaydi ve lisans kontrolu</li>
          </ul>
        </div>
        <div className="license-panel-preview">
          <div className="panel-card">
            <h3>Web panelinde ne var?</h3>
            <ul className="panel-list">
              <li><Link href="/login">Giris yap</Link> ve oturum yonetimi</li>
              <li><Link href="/register">Kayit ol</Link> ve trial baslatma</li>
              <li><Link href="/forgot-password">Sifre sifirlama</Link></li>
              <li><Link href="/panel/license">Lisans paneli</Link></li>
              <li><Link href="/panel/devices">Cihaz paneli</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-section plans-section">
        <div className="section-heading">
          <div className="eyebrow">Lisans Planlari</div>
          <h2>Trial, academic ve institution modelini ayni panelde yonetin</h2>
        </div>
        <div className="plans-grid-web">
          <article className="plan-box">
            <span className="plan-tag">Deneme</span>
            <h3>Trial</h3>
            <p>Akademik ve pilot kullanim ilk kayitta 7 gunluk trial ile baslar.</p>
            <strong>7 gun</strong>
          </article>
          <article className="plan-box featured-plan">
            <span className="plan-tag">Akademik</span>
            <h3>ORCID verified</h3>
            <p>ORCID dogrulamasi sonrasinda academic lisans sureklilik kazanir.</p>
            <strong>Sinirsiz akademik kullanim</strong>
          </article>
          <article className="plan-box">
            <span className="plan-tag">Kurum</span>
            <h3>Enterprise</h3>
            <p>Kurum kullaniminda cihaz limiti ve panel yonetimi daha genis tutulur.</p>
            <strong>10 cihaza kadar baslangic modeli</strong>
          </article>
        </div>
      </section>

      <section className="content-section" id="faq">
        <div className="section-heading">
          <div className="eyebrow">SSS</div>
          <h2>Teknik vaatler ve urun gercegi ayni hizda olmali</h2>
        </div>
        <div className="faq-stack">
          {faqs.map((item) => (
            <article className="faq-card" key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div>
          <div className="eyebrow">Sonraki adim</div>
          <h2>TumorArchives&apos;i aktif pilot kullanim asamasina tasiyin</h2>
          <p>Kayit ol, trial baslat, ORCID ile dogrula ve cihazlarini panelden yonet.</p>
        </div>
        <div className="marketing-actions">
          <Link href="/register" className="button primary">Kayit Ol</Link>
          <Link href="/login" className="button secondary">Giris Yap</Link>
        </div>
      </section>

      <footer className="site-footer">
        <Link href="/privacy">Gizlilik Politikasi</Link>
        <Link href="/terms">Kullanim Kosullari</Link>
        <Link href="/contact">Iletisim</Link>
        <Link href="/releases">Surum Notlari</Link>
      </footer>
    </main>
  );
}
