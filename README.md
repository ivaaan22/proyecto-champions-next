# Champions SaaS

Minimal **multi-user SaaS** for browsing **teams** and **matches**, posting **match comments**, and managing content through **role-based backoffice** panels (`EDITOR`, `ADMIN`). Built as the **M0613 IA7** deliverable (block *Creació d'un SaaS*, sessions S16–S20).

**Live demo:** https://proyecto-champions-next.vercel.app  
**Repository:** https://github.com/ivaaan22/proyecto-champions-next

---

## Why this project

Fans and editors need a single place to **publish** Champions-style fixtures and media, while **registered users** can discuss matches. The app separates **public catalog**, **social features**, and **internal tooling** with clear authorization — a common pattern in real B2B/B2C SaaS products.

---

## Features

### Public
- Browse all **32 teams** with search and country filter.
- **Team detail** page with match history and W/D/L stats.
- Browse **matches** filtered by phase (Groups / Quarter-finals / Semi-finals / Final) and status (Finished / Upcoming).
- **Match detail** page with full scoreline.
- **Standings** table with colour-coded qualification zones (Top 8 → Round of 16, 9–24 → Playoff, 25–32 → Eliminated).

### Authenticated users
- **Sign up** and **sign in** via Supabase Auth.
- Upload and update **profile avatar** (stored in Supabase Storage).
- Post **comments** on matches.

### Backoffice
- **`EDITOR`**: manage teams and matches.
- **`ADMIN`**: full access including user and **role** management (`USER`, `EDITOR`, `ADMIN`).

### Product / engineering
- **User stories** implemented incrementally following **Scrum** methodology (sessions S19–S20).
- Data seeded via SQL for local and production demos.
- **Supabase Storage** bucket for user avatars.
- Role-based middleware protecting backoffice routes.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 16** (App Router), **React 19**, **TypeScript** |
| ORM / DB | **Prisma 7** → **PostgreSQL** (hosted on **Supabase**) |
| Auth | **Supabase Auth** |
| UI | **Tailwind CSS v4** |
| Media | **Supabase Storage** |
| Deploy | **Vercel** (app) + **Supabase** (DB, auth, storage) |

---

## Architecture

```
Browser → Next.js App Router (RSC + Client Components)
               → Prisma (pg adapter) → Supabase PostgreSQL
               → Supabase Auth (sessions via @supabase/ssr)
               → Supabase Storage (avatar uploads)
               → API Routes (/api/comments, /api/users/[id]/role)
```

- **Public routes** expose teams, matches and standings for visitors.
- **Authenticated routes** allow commenting on matches.
- **Backoffice** (`/backoffice/*`) protected by middleware — EDITOR and ADMIN only.

---

## Prerequisites

- **Node.js** LTS
- A **Supabase** project (PostgreSQL + Auth + Storage bucket `avatars`)
- **Git**

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/ivaaan22/proyecto-champions-next.git
cd proyecto-champions-next
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your values (see **Environment** section below). Never commit `.env`.

### 3. Database

```bash
npx prisma generate
npx prisma db push
```

Then seed the database with teams and matches via **Supabase SQL Editor** (see `prisma/seed/seed.ts` for reference data).

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Supabase **pooled** Postgres URL (port 6543, for Prisma client) |
| `DIRECT_URL` | Supabase **direct** URL (port 5432, for migrations) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

Full template in `.env.example` (no secrets).

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js in development (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:seed` | Run the Prisma seed script |

---

## Project structure

```
proyecto-champions-next/
├── app/
│   ├── (public)/           # Public routes (teams, matches, standings)
│   │   ├── page.tsx        # Home
│   │   ├── teams/          # Team list + detail
│   │   ├── matches/        # Match list + detail + comments
│   │   └── standings/      # Classification table
│   ├── (auth)/             # Auth routes (login, register)
│   ├── backoffice/         # Protected backoffice (EDITOR + ADMIN)
│   │   ├── teams/
│   │   ├── matches/
│   │   └── users/          # Role management (ADMIN only)
│   └── api/
│       └── comments/       # POST comment
├── components/             # Header, Footer, CommentSection
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   └── supabase/           # Server + client Supabase helpers
├── prisma/
│   ├── schema.prisma       # Data model (Profile, Team, Match, Comment)
│   └── seed/seed.ts        # Seed script
├── types/                  # Shared TypeScript types
└── middleware.ts            # Route protection by role
```

---

## Verification checklist (IA7)

- [x] Visitor can browse **teams** and **matches** with DB-backed data.
- [x] User can **register** and **log in** via Supabase Auth.
- [x] Registered user can **upload avatar** and **comment** on a match.
- [x] `EDITOR` can manage teams and matches in backoffice.
- [x] `ADMIN` can manage users and roles.
- [x] App deploys to **Vercel** with production env vars set safely.

---

## Deployment

1. Push to GitHub and connect the repo to **Vercel**.
2. Set all environment variables in the Vercel dashboard.
3. Vercel builds and deploys automatically on every push to `master`.

---

## Academic context

Developed as **IA7 — Kates Serveis web** within **M0613** (DAW2).  
Product discovery and backlog: **Scrum** (session S19).  
Implementation: guided sprints (session S20).

---

## License

Educational use — all rights reserved for classroom purposes.

---

## Author

**Ivan Garcia** — [GitHub](https://github.com/ivaaan22)
