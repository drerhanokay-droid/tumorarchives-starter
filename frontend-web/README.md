# TumorArchives Web

Minimal Next.js frontend for the TumorArchives backend.

## Prerequisites

- Node.js 20+
- Running backend API at `http://127.0.0.1:8000`

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

`NEXT_PUBLIC_API_BASE_URL`
: Base URL for the FastAPI backend. Default example value is `http://127.0.0.1:8000`.

## Current Pages

- `/` health check against backend
- `/login` login form plus license check

## Backend Requirement

The backend must be started with CORS enabled for local browser clients such as `localhost:3000`.
