'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthShell } from '@/components/auth-shell';
import { checkLicense, login } from '@/lib/api';
import { saveToken } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const auth = await login(email, password);
      saveToken(auth.access_token);
      const license = await checkLicense(auth.access_token);
      setResult(JSON.stringify({ auth, license }, null, 2));
    } catch (err: unknown) {
      setResult(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Giris"
      title="Hesap, lisans ve cihaz dogrulamasini baslat"
      description="Bu ekran hasta verisini acmaz; once hesap dogrulanir, sonra lisans ve cihaz yetkisi kontrol edilir."
    >
      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          <span>E-posta</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@kurum.edu.tr" required />
        </label>
        <label>
          <span>Sifre</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </label>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Dogrulaniyor...' : 'Giris Yap'}
        </button>
        <div className="inline-links">
          <Link href="/forgot-password">Sifremi unuttum</Link>
          <Link href="/register">Kayit Ol</Link>
        </div>
      </form>
      <pre className="result-box">{result || 'Basarili giriste token ve lisans ozeti burada gorunur.'}</pre>
    </AuthShell>
  );
}
