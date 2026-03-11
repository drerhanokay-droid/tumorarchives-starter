# TumorArchives Starter

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18969370.svg)](https://doi.org/10.5281/zenodo.18969370)

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

cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn app.main:app --reload

@software{erhanokay_2026_tumorarchives_starter,
  author  = {Erhan Okay},
  title   = {TumorArchives Starter},
  year    = {2026},
  version = {v1.0.0},
  doi     = {10.5281/zenodo.18969370},
  url     = {https://doi.org/10.5281/zenodo.18969370}
}


