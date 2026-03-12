'use client';

import { useEffect, useMemo, useState } from 'react';
import { PanelShell } from '@/components/panel-shell';
import { getToken } from '@/lib/auth';
import { listContactRequests, updateContactRequestStatus, type ContactRequestRecord } from '@/lib/api';

const statuses = ['new', 'contacted', 'qualified'];

export default function InboxPage() {
  const [items, setItems] = useState<ContactRequestRecord[]>([]);
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getToken();
      if (!token) {
        if (!cancelled) {
          setError('Inbox goruntulemek icin once giris yapmalisiniz.');
        }
        return;
      }

      try {
        const requests = await listContactRequests(token);
        if (!cancelled) {
          setItems(requests);
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

  async function handleStatusChange(requestId: number, status: string) {
    const token = getToken();
    if (!token) {
      setError('Oturum bulunamadi.');
      return;
    }

    setLoadingId(requestId);
    setError('');
    try {
      await updateContactRequestStatus(token, requestId, status);
      setItems((current) => current.map((item) => (item.id === requestId ? { ...item, status } : item)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoadingId(null);
    }
  }

  const summary = useMemo(() => {
    return statuses.map((status) => ({
      status,
      count: items.filter((item) => item.status === status).length,
    }));
  }, [items]);

  const latestItem = items[0];

  return (
    <PanelShell
      title="Basvuru inbox"
      description="Contact formundan gelen talepler burada operasyonel hale gelir. Bu ekran lead toplama akisinin filtrelenmis panel gorunumudur."
    >
      <div className="panel-grid panel-grid-emphasis">
        <section className="panel-card panel-card-highlight">
          <div className="panel-card-headline">
            <div>
              <span className="workspace-section-kicker">Inbox ozeti</span>
              <h2>Durum dagilimi ve son talep</h2>
            </div>
          </div>

          <div className="stats-grid stats-grid-wide stats-grid-triple">
            {summary.map((item) => (
              <div key={item.status} className="stat-box">
                <span>{item.status}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>

          <div className="action-banner action-banner-soft">
            <div>
              <strong>Son talep</strong>
              <span>
                {latestItem
                  ? `${latestItem.full_name} · ${latestItem.usage_type} · ${new Date(latestItem.created_at).toLocaleDateString('tr-TR')}`
                  : 'Henuz panelde islenecek talep yok.'}
              </span>
            </div>
          </div>
        </section>

        <section className="panel-card">
          <div className="panel-card-headline">
            <div>
              <span className="workspace-section-kicker">Akis kurali</span>
              <h2>Lead isleme adimlari</h2>
            </div>
          </div>
          <div className="ops-step-list">
            <article>
              <strong>new</strong>
              <span>Yeni gelen talep, henuz geri donus yapilmadi.</span>
            </article>
            <article>
              <strong>contacted</strong>
              <span>E-posta veya gorusme yapildi, takip acildi.</span>
            </article>
            <article>
              <strong>qualified</strong>
              <span>Pilot, akademik veya kurum gorusmesine uygun bulundu.</span>
            </article>
          </div>
        </section>

        <section className="panel-card panel-card-span-2">
          <div className="panel-card-headline">
            <div>
              <span className="workspace-section-kicker">Gelen talepler</span>
              <h2>Operasyon listesi</h2>
            </div>
          </div>
          {items.length > 0 ? (
            <div className="inbox-list">
              {items.map((item) => (
                <article key={item.id} className="inbox-item">
                  <div className="inbox-head">
                    <div>
                      <strong>{item.full_name}</strong>
                      <span>{item.email}</span>
                    </div>
                    <div>
                      <strong>{item.usage_type}</strong>
                      <span>{new Date(item.created_at).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                  <div className="inbox-meta">
                    <span>Brans: {item.specialty || '-'}</span>
                    <span>Cihaz: {item.device_count || '-'}</span>
                    <span>ORCID: {item.orcid_status || '-'}</span>
                  </div>
                  <div className="inbox-status-row">
                    <span className={`status-pill status-${item.status}`}>{item.status}</span>
                    <div className="status-actions">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          className="button secondary inline-button"
                          onClick={() => handleStatusChange(item.id, status)}
                          disabled={loadingId === item.id || item.status === status}
                        >
                          {loadingId === item.id && item.status !== status ? 'Guncelleniyor...' : status}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p>{item.message || 'Ek not girilmedi.'}</p>
                </article>
              ))}
            </div>
          ) : (
            <pre className="result-box">{error || 'Henuz basvuru yok.'}</pre>
          )}
        </section>
      </div>
    </PanelShell>
  );
}
