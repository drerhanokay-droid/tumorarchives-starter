'use client';

import { useEffect, useState } from 'react';
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

  return (
    <PanelShell
      title="Basvuru inbox"
      description="Contact formundan gelen talepler burada gorunur. Bu sayfa lead toplama akisinin panel tarafidir."
    >
      <section className="panel-card">
        <h2>Gelen talepler</h2>
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
    </PanelShell>
  );
}
