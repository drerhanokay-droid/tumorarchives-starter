README
```md
# TumorArchives Starter

Device-first tumor archive starter kit for mobile oncology workflows.

## Stack
- Mobile: Expo + React Native + TypeScript
- Backend: FastAPI
- Storage model: patient data stays on device (mobile-local first)

## Project Structure
- `mobile/` Expo mobile app
- `backend/` FastAPI auth/license skeleton
- `docs/` architecture and planning docs
- `landing/` landing page prototype

## Run Mobile
```bash
cd mobile
npm install
npx expo start -c
```

## Run Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn app.main:app --reload
```

## API
- Health: `GET /health`
- Auth: `POST /auth/register`, `POST /auth/login`
- License: `GET /license/check`, `POST /license/register-device`

## Notes
- This is a starter kit, not a finished clinical product.
- Add legal/compliance text and local regulations (e.g. KVKK/GDPR) before production use.
```


















Commit message: örn. Add README with setup and usage guide
Commit directly to the main branch 
