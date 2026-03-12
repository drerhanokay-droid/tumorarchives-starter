# TumorArchives Web

Bu frontend, TumorArchives urununun web katmani icin hazirlanan Next.js uygulamasidir.

## Kapsam
- landing ana sayfasi
- `/login`
- `/register`
- `/forgot-password`
- `/panel/license`
- `/panel/devices`
- `/panel/inbox`
- `/privacy`
- `/terms`
- `/contact`
- `/releases`

## Kritik ilke
Bu web katmani hasta verisini gostermez. Hasta verisi cihazda kalir. Web sadece auth, lisans, ORCID, basvuru toplama ve cihaz yonetimi icin kullanilir.

## Gelistirme
```bash
npm install
npm run dev
```

## Env
`.env.local`
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Vercel deployment

### Frontend env
Vercel proje ayarlarinda su env tanimlanmalidir:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com
```

### Backend env
Backend tarafinda `.env` veya deploy provider env ayarlarina su alanlar tanimlanmalidir:
```env
APP_ENV=production
SECRET_KEY=strong-random-secret
DATABASE_URL=postgresql+psycopg://user:pass@host/dbname
ACCESS_TOKEN_MINUTES=43200
CORS_ALLOW_ORIGINS=https://your-app.vercel.app,https://your-domain.com
```

### Deployment sirasi
1. Backend'i ayaga kaldir
2. Backend domain'ini dogrula
3. `NEXT_PUBLIC_API_BASE_URL` ile Vercel frontend'i deploy et
4. Login, register, contact ve panel akislarini production domain'de test et

## Production notlari
- `CORS_ALLOW_ORIGINS` production domain'lerle eslesmelidir
- SQLite yerine production'da Postgres tercih edilmelidir
- `contact-requests` su an panel inbox'a yazilir; sonraki fazda mail provider veya CRM baglanabilir
