'use client';

import { useEffect, useState } from 'react';
import { PanelShell } from '@/components/panel-shell';
import { checkLicense, verifyOrcid, type LicenseStatus } from '@/lib/api';
import { getToken } from '@/lib/auth';

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

  return (
    <PanelShell
      title="Lisans paneli"
      description="Bu panel hasta verisini degil; lisans, ORCID ve offline kullanim kurallarini gosterir."
    >
      <div className="panel-grid">
        <section className="panel-card">
          <h2>Canli lisans ozeti</h2>
          {data ? (
            <>
              <div className="stats-grid">
                <div className="stat-box"><span>Plan</span><strong>{data.plan ?? '-'}</strong></div>
                <div className="stat-box"><span>Aktif cihaz</span><strong>{data.active_devices ?? 0} / {data.max_devices ?? 0}</strong></div>
                <div className="stat-box"><span>Durum</span><strong>{data.valid ? 'Gecerli' : 'Gecersiz'}</strong></div>
                <div className="stat-box"><span>Bitis</span><strong>{data.expires_at ? new Date(data.expires_at).toLocaleDateString('tr-TR') : 'Sinirsiz / tanimsiz'}</strong></div>
              </div>
              {data.plan === 'trial' ? (
                <button className="button primary verify-button" onClick={handleVerifyOrcid} disabled={upgrading}>
                  {upgrading ? 'ORCID dogrulaniyor...' : 'ORCID ile akademik lisansa gec'}
                </button>
              ) : null}
            </>
          ) : (
            <pre className="result-box">{error || 'Lisans bilgisi yukleniyor...'}</pre>
          )}
        </section>
        <section className="panel-card">
          <h2>Kural seti</h2>
          <ul className="panel-list">
            <li>Akademik ve pilot kayitlari 7 gunluk trial ile baslar.</li>
            <li>ORCID dogrulamasi trial lisansi academic lisansa cevirir.</li>
            <li>Hasta verisi sunucuya aktarilmaz.</li>
            <li>30 gun sonunda yeni lisans dogrulamasi gerekir.</li>
          </ul>
          {error ? <pre className="result-box">{error}</pre> : null}
        </section>
      </div>
    </PanelShell>
  );
}
