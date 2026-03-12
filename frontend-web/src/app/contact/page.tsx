'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createContactRequest } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    specialty: '',
    usage_type: 'academic',
    device_count: '1-3',
    orcid_status: 'unknown',
    message: '',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const response = await createContactRequest(form);
      setResult(JSON.stringify(response, null, 2));
      setForm({
        full_name: '',
        email: '',
        specialty: '',
        usage_type: 'academic',
        device_count: '1-3',
        orcid_status: 'unknown',
        message: '',
      });
    } catch (err: unknown) {
      setResult(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="doc-page">
      <div className="doc-shell contact-shell">
        <section className="doc-card contact-main">
          <div className="eyebrow">Iletisim</div>
          <h1>TumorArchives icin erken erisim ve pilot kullanim akisi</h1>
          <p>Bu sayfa artik gercek basvuru toplar. Form backend&apos;e kaydedilir; sonraki adimda mail provider veya panel inbox ile baglanabilir.</p>
          <form className="form-grid" onSubmit={onSubmit}>
            <label>
              <span>Ad Soyad</span>
              <input value={form.full_name} onChange={(e) => setForm((current) => ({ ...current, full_name: e.target.value }))} required />
            </label>
            <label>
              <span>E-posta</span>
              <input type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} required />
            </label>
            <label>
              <span>Brans / uzmanlik</span>
              <input value={form.specialty} onChange={(e) => setForm((current) => ({ ...current, specialty: e.target.value }))} placeholder="Ortopedi, medikal onkoloji, patoloji..." />
            </label>
            <label>
              <span>Kullanim tipi</span>
              <select value={form.usage_type} onChange={(e) => setForm((current) => ({ ...current, usage_type: e.target.value }))}>
                <option value="academic">Akademik</option>
                <option value="pilot">Klinik pilot</option>
                <option value="institution">Kurum</option>
              </select>
            </label>
            <label>
              <span>Tahmini cihaz sayisi</span>
              <select value={form.device_count} onChange={(e) => setForm((current) => ({ ...current, device_count: e.target.value }))}>
                <option value="1-3">1-3</option>
                <option value="4-10">4-10</option>
                <option value="10+">10+</option>
              </select>
            </label>
            <label>
              <span>ORCID durumu</span>
              <select value={form.orcid_status} onChange={(e) => setForm((current) => ({ ...current, orcid_status: e.target.value }))}>
                <option value="unknown">Belirsiz</option>
                <option value="available">Var</option>
                <option value="not-available">Yok</option>
              </select>
            </label>
            <label>
              <span>Not</span>
              <textarea className="contact-textarea" value={form.message} onChange={(e) => setForm((current) => ({ ...current, message: e.target.value }))} placeholder="Tumor tipi, kullanim senaryosu, pilot beklentisi..." />
            </label>
            <button type="submit" className="button primary" disabled={loading}>
              {loading ? 'Gonderiliyor...' : 'Basvuruyu Gonder'}
            </button>
          </form>
          <pre className="result-box">{result || 'Form gonderildiginde backend cevabi burada gorunur.'}</pre>
        </section>
        <aside className="doc-card">
          <h2>Temel bilgi paketi</h2>
          <ul className="panel-list">
            <li>Brans ve kullanim senaryosu</li>
            <li>Tahmini cihaz sayisi</li>
            <li>ORCID durumu</li>
            <li>Akademik / pilot / kurum ihtiyaci</li>
          </ul>
          <p className="doc-muted">Bir sonraki fazda bu istekler panel inbox veya e-posta servisine yonlendirilebilir.</p>
        </aside>
        <Link href="/" className="doc-back">TumorArchives ana sayfa</Link>
      </div>
    </main>
  );
}
