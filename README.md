# Travel App

Next.js (App Router, TypeScript) + Prisma + PostgreSQL.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and set:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/travel_app?sslmode=require"
AUTH_SECRET="generate with: npx auth secret"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

Google sign-in is optional. Leave `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` empty to hide the button.

Local Postgres:

```bash
DATABASE_URL="postgresql://travel:traveldev@localhost:5432/travel_app"
```

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm test
npm run build
npm run db:generate
npm run db:migrate
npm run db:migrate:deploy
```

## Tests

Tests cover trip duration, packing-list parsing, calendar occupancy, and trip ownership helpers:

- same-day trip = 1 day
- inclusive range (May 1–5 = 5 days)
- leap year vs non-leap year
- date-only UTC strings
- end date before start date throws

```bash
npm test
```

## Deploy (Vercel + Neon/Supabase)

The app is a Next.js full stack project (API routes + Prisma), so it needs a Node
runtime and a hosted Postgres database. GitHub alone only stores the code.

Repo: https://github.com/skykarki/vacation-calculator (default branch `master`).

1. Create a Postgres database on [Neon](https://neon.tech) or
   [Supabase](https://supabase.com) and copy the pooled connection string
   (keep `?sslmode=require`).
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, choose
   **Add New Project**, and import `vacation-calculator`. Vercel auto-detects
   Next.js; leave build settings as default.
3. Before the first deploy, open **Environment Variables** and add:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/dbname?sslmode=require"
AUTH_SECRET="generate with: npx auth secret"
AUTH_URL="https://your-app.vercel.app"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

4. Deploy. On Vercel the `vercel-build` script runs automatically:
   `prisma generate && prisma migrate deploy && next build`, so schema
   migrations are applied to the hosted database on every deploy.
5. Open the deployed URL, sign up, and check `GET /api/health` returns
   `{"ok":true,"database":"connected"}`.
6. After the first deploy, set `AUTH_URL` to the real Vercel URL and redeploy.

`AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are optional; leave them empty to hide
the Google button.

## Structure

```text
src/
  app/
    api/          backend routes
    dashboard/    main app pages
    flights/      air ticket search and booking
    trips/        trip list/create pages
  components/     reusable UI
  lib/            db client, date-utils, auth config
prisma/
  schema.prisma   database models
```
