"use client";

import { useState } from "react";
import { checkLicense, login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const auth = await login(email, password);
      localStorage.setItem("ta_token", auth.access_token);
      const license = await checkLicense(auth.access_token);
      setResult(JSON.stringify({ auth, license }, null, 2));
    } catch (err: any) {
      setResult(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1>TumorArchives Login</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }} />
        <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }} />
        <button type="submit" disabled={loading} style={{ padding: 10, borderRadius: 8 }}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
      <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>{result}</pre>
    </main>
  );
}
