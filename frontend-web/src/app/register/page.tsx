'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthShell } from '@/components/auth-shell';
import { register } from '@/lib/api';
import { saveToken } from '@/lib/auth';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usageType, setUsageType] = useState('academic');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const auth = await register({ full_name: fullName, email, password, usage_type: usageType });
      saveToken(auth.access_token);
      setResult(JSON.stringify({ auth, usageType }, null, 2));
    } catch (err: unknown) {
      setResult(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Kayit Ol"
      title="Akademik, pilot veya kurum profili ile kayit ol"
      description="Akademik ve pilot akislari ilk kayitta 7 gunluk trial olarak baslar. ORCID dogrulamasi sonrasinda akademik lisans sureklilik kazanir."
    >
      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          <span>Ad Soyad</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Dr. Ad Soyad" required />
        </label>
        <label>
          <span>E-posta</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@kurum.edu.tr" required />
        </label>
        <label>
          <span>Sifre</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="En az 8 karakter" required />
        </label>
        <label>
          <span>Kullanim tipi</span>
          <select value={usageType} onChange={(e) => setUsageType(e.target.value)}>
            <option value="academic">Akademik</option>
            <option value="pilot">Klinik pilot</option>
            <option value="institution">Kurum</option>
          </select>
        </label>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Hesap olusturuluyor...' : 'Kayit Ol'}
        </button>
        <div className="inline-links">
          <Link href="/login">Zaten hesabim var</Link>
        </div>
      </form>
      <pre className="result-box">{result || 'Kayit sonrasi token ve secilen kullanim tipi burada gorunur.'}</pre>
    </AuthShell>
  );
}
