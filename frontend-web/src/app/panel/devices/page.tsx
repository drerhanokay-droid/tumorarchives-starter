'use client';

import { useEffect, useState } from 'react';
import { PanelShell } from '@/components/panel-shell';
import { deleteDevice, listDevices, type DeviceRecord } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);

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
        const nextDevices = await listDevices(token);
        if (!cancelled) {
          setDevices(nextDevices);
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

  async function handleDelete(deviceId: number) {
    const token = getToken();
    if (!token) {
      setError('Oturum bulunamadi.');
      return;
    }

    setLoadingId(deviceId);
    setError('');
    try {
      await deleteDevice(token, deviceId);
      setDevices((current) => current.filter((device) => device.id !== deviceId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <PanelShell
      title="Cihaz paneli"
      description="Web paneli cihazlarin kaydini, lisans kotasini ve son aktivite bilgisini yonetir. Hasta verisi bu panelde gorunmez."
    >
      <section className="panel-card">
        <h2>Kayitli cihazlar</h2>
        {devices.length > 0 ? (
          <div className="device-table">
            {devices.map((device) => (
              <div className="device-row" key={device.id}>
                <div>
                  <strong>{device.device_name || 'Isimsiz cihaz'}</strong>
                  <span>{device.platform} · {device.device_uid}</span>
                </div>
                <div>
                  <strong>{new Date(device.last_seen_at).toLocaleString('tr-TR')}</strong>
                  <button className="button secondary inline-button" onClick={() => handleDelete(device.id)} disabled={loadingId === device.id}>
                    {loadingId === device.id ? 'Kaldiriliyor...' : 'Cihazi Kaldir'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <pre className="result-box">{error || 'Kayitli cihaz bulunmuyor.'}</pre>
        )}
      </section>
      <section className="panel-card">
        <h2>Planlanan islemler</h2>
        <ul className="panel-list">
          <li>Cihaz kaldirma</li>
          <li>Kota bosaltma</li>
          <li>Yeniden yetkilendirme</li>
          <li>Panel uzerinden cihaz gecmisi izleme</li>
        </ul>
      </section>
    </PanelShell>
  );
}
