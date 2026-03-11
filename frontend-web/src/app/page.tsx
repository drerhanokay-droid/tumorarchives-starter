import { API_BASE_URL } from '@/lib/api';

async function getHealth() {
  const res = await fetch(`${API_BASE_URL}/health`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export default async function Home() {
  const data = await getHealth();
  return (
    <main style={{ padding: 24, fontFamily: 'monospace' }}>
      <h1>TumorArchives Web</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
