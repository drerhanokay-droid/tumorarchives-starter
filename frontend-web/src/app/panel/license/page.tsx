'use client';

import { useEffect, useMemo, useState } from 'react';
import { PanelShell } from '@/components/panel-shell';
import { checkLicense, verifyOrcid, type LicenseStatus } from '@/lib/api';
import { getToken } from '@/lib/auth';

const ruleItems = [
  'Akademik ve pilot kayitlari 7 gunluk trial ile baslar.',
  'ORCID dogrulamasi trial lisansi academic lisansa cevirir.',
  'Hasta verisi sunucuya aktarilmaz.',
  '30 gun sonunda yeni lisans dogrulamasi gerekir.',
];

export default function LicensePage() {
  const [data, setData] = useState<LicenseStatus | null>(null);
  const [error, setError] = useState('');
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getToken();
      if (!token) {
        if (!cancelled) {
          setError('Panel verisini gormek icin once giris yapmalisiniz.');
        }
        return;
      }

      try {
        const license = await checkLicense(token);
        if (!cancelled) {
          setData(license);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleVerifyOrcid() {
    const token = getToken();
    if (!token) {
      setError('Oturum bulunamadi.');
      return;
    }

    setUpgrading(true);
    setError('');
    try {
      await verifyOrcid(token);
      const license = await checkLicense(token);
      setData(license);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setUpgrading(false);
    }
  }

  const featureList = useMemo(() => {
    if (!data?.features || data.features.length === 0) {
      return ['Auth', 'Lisans kontrolu', 'Cihaz yonetimi'];
    }
    return data.features;
  }, [data]);

  const deviceUsageLabel = data ? `${data.active_devices ?? 0} / ${data.max_devices ?? 0}` : '-';
  const validityLabel = data ? (data.valid ? 'Gecerli' : 'Gecersiz') : '-';
  const expiryLabel = data?.expires_at ? new Date(data.expires_at).toLocaleDateString('tr-TR') : 'Sinirsiz / tanimsiz';

  return (
    <PanelShell
      title="Lisans paneli"
      description="Bu panel klinik kaydi degil; plan, ORCID gecisi, cihaz kotasi ve offline kullanim sinirlarini gosterir."
    >
      <div className="panel-grid panel-grid-emphasis">
        <section className="panel-card panel-card-highlight">
          <div className="panel-card-headline">
            <div>
              <span className="workspace-section-kicker">Canli lisans ozeti</span>
              <h2>Plan, kota ve gecerlilik</h2>
            </div>
            {data ? <span className={`status-pill ${data.valid ? 'status-qualified' : 'status-contacted'}`}>{validityLabel}</span> : null}
          </div>

          {data ? (
            <>
              <div className="stats-grid stats-grid-wide">
                <div className="stat-box"><span>Plan</span><strong>{data.plan ?? '-'}</strong></div>
                <div className="stat-box"><span>Aktif cihaz</span><strong>{deviceUsageLabel}</strong></div>
                <div className="stat-box"><span>Durum</span><strong>{validityLabel}</strong></div>
                <div className="stat-box"><span>Bitis</span><strong>{expiryLabel}</strong></div>
              </div>

              <div className="feature-chip-row">
                {featureList.map((feature) => (
                  <span key={feature} className="feature-chip">{feature}</span>
                ))}
              </div>

              {data.plan === 'trial' ? (
                <div className="action-banner">
                  <div>
                    <strong>Trial modundasiniz</strong>
                    <span>ORCID dogrulamasi ile academic plana gecerek sure sinirini kaldirabilirsiniz.</span>
                  </div>
                  <button className="button primary verify-button" onClick={handleVerifyOrcid} disabled={upgrading}>
                    {upgrading ? 'ORCID dogrulaniyor...' : 'ORCID ile akademik lisansa gec'}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <pre className="result-box">{error || 'Lisans bilgisi yukleniyor...'}</pre>
          )}
        </section>

        <section className="panel-card">
          <div className="panel-card-headline">
            <div>
              <span className="workspace-section-kicker">Kural seti</span>
              <h2>Politika ve operasyon notlari</h2>
            </div>
          </div>
          <ul className="panel-list">
            {ruleItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {error ? <pre className="result-box">{error}</pre> : null}
        </section>

        <section className="panel-card">
          <div className="panel-card-headline">
            <div>
              <span className="workspace-section-kicker">Sonraki adim</span>
              <h2>Operasyon akisi</h2>
            </div>
          </div>
          <div className="ops-step-list">
            <article>
              <strong>1. Auth dogrula</strong>
              <span>Hesap ve token gecerliyse lisans sorgusu yapilir.</span>
            </article>
            <article>
              <strong>2. Plani yorumla</strong>
              <span>Trial, academic veya institution kurallari panelde uygulanir.</span>
            </article>
            <article>
              <strong>3. Cihaz yetkisini koru</strong>
              <span>Yeni cihazlar devices panelinden takip edilir ve kota bosaltma buradan yonetilir.</span>
            </article>
          </div>
        </section>
      </div>
    </PanelShell>
  );
}
