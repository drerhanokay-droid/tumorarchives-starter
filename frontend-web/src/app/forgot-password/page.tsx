'use client';

import { useState } from 'react';
import { AuthShell } from '@/components/auth-shell';
import { forgotPassword } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const response = await forgotPassword(email);
      setResult(JSON.stringify(response, null, 2));
    } catch (err: unknown) {
      setResult(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Sifre Sifirlama"
      title="Auth sifresini sifirla, lokal veriyi degil"
      description="Bu ekran auth katmanini hedefler. Hasta verisi cihazda kaldigi icin sifre sifirlama ile klinik veri sunucuya tasinmaz."
    >
      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          <span>E-posta</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@kurum.edu.tr" required />
        </label>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Gonderiliyor...' : 'Sifre sifirlama baglantisi gonder'}
        </button>
      </form>
      <pre className="result-box">{result || 'API cevabi burada gorunur.'}</pre>
    </AuthShell>
  );
}
