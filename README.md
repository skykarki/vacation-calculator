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

1. Create a Postgres database on [Neon](https://neon.tech) or [Supabase](https://supabase.com) and copy the connection string.
2. Push the repo to GitHub and import it in [Vercel](https://vercel.com).
3. Set environment variables in the Vercel project:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/dbname?sslmode=require"
AUTH_SECRET="generate with: npx auth secret"
AUTH_URL="https://your-app.vercel.app"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

4. Run migrations against the hosted database (once):

```bash
npx prisma migrate deploy
```

5. Deploy. `postinstall` already runs `prisma generate`. The Next.js app includes API routes, so frontend and backend ship together.

## Structure

```text
src/
  app/
    api/          backend routes
    dashboard/    main app pages
    trips/        trip list/create pages
  components/     reusable UI
  lib/            db client, date-utils, auth config
prisma/
  schema.prisma   database models
```
