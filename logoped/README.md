# Logoped

Logoped is a fullstack project for speech exercises. The frontend is built with Vite + React, and the backend uses NestJS + Prisma + PostgreSQL.

## Project structure

- `backend` — NestJS API, Prisma schema, migrations, seed
- `frontend` — React client

## Run database

From the backend directory:

```bash
cd backend
docker-compose up -d
```

PostgreSQL will be available on `localhost:5432`.

## Run backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run start:dev
```

Backend starts on `http://localhost:3000`.

## Run frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend expects:

```env
VITE_API_URL=http://localhost:3000
```

## Prisma workflow

Apply migrations:

```bash
cd backend
npm run prisma:migrate
```

Seed exercise cards:

```bash
cd backend
npm run db:seed
```

## Current fullstack step

- auth remains in place
- exercise cards are stored in PostgreSQL
- backend exposes CRUD endpoints at `/cards`
- frontend loads feed cards from the backend instead of a hardcoded array
