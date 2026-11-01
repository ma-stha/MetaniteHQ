# Metanite HQ

Internal operating system for Metanite Marketing: leads, clients, engagements, the seven-dimension marketing audit, and Strategic Marketing Playbook generation.

Live: https://metanite-hq.vercel.app
Plan and scope: [docs/PLAN.md](docs/PLAN.md). Brand tokens: [docs/BRAND.md](docs/BRAND.md).

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Supabase (Postgres, Auth, Storage, Row Level Security). Hosted on Vercel with Supabase in Sydney.

## Run it locally

Requires Node 22 and npm.

```bash
git clone https://github.com/ma-stha/MetaniteHQ.git
cd MetaniteHQ
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The two public values in `.env.example` are already correct for the `metanite-hq` Supabase project. Fill `SUPABASE_SERVICE_ROLE_KEY` only when a stage needs it; copy it from the Supabase dashboard (Project Settings, API Keys). Never commit `.env.local`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (what Vercel runs) |
| `npm run lint` | ESLint, including the rule that keeps the admin client out of UI code |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (scoring maths, later access rules) |

CI runs all four checks on every push and pull request.

## Layout

| Path | Purpose |
| --- | --- |
| `app/` | Routes. Thin files that call feature code. |
| `features/` | One folder per domain: `actions.ts` (writes), `queries.ts` (reads), `schema.ts` (validation), `components/`. |
| `components/ui/` | Brand-styled building blocks: Button, Input, Card, Badge, Table, StatTile. |
| `lib/` | Supabase clients, env validation, scoring maths. |
| `supabase/migrations/` | Numbered SQL files. The only way the database schema changes. |
| `tests/` | Vitest unit tests. |
| `docs/` | Plan, brand, business context, decision records. |
| `brand/` | Logo and icon source files. |

## Deploying

Push to `main`. Vercel builds and deploys automatically. Environment variables live in Vercel (Project, Settings, Environment Variables): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Maintaining

- **Add a field to a form:** edit the Zod schema in `features/<domain>/schema.ts`, the form component, and, if stored in its own column, add a migration.
- **Add a table:** new SQL file in `supabase/migrations/` with RLS enabled and policies for all three roles, then a `queries.ts` and `actions.ts` in the matching feature folder.
- **Change a colour or font:** `app/globals.css` and `docs/BRAND.md`. Nothing else should contain a hex value.
- **Update dependencies:** `npm outdated`, then update one group at a time and run `npm run build`.
- **Backups:** Supabase Pro has daily backups. On the free tier, run a weekly `pg_dump` using the connection string from the dashboard.

## Stages

| Stage | Status |
| --- | --- |
| 0 Foundations: app, tokens, UI kit, Supabase wiring, CI | Done |
| 1 Auth, roles, invite flow, app shell, dashboard skeleton | Next |
| 2 Clients, contacts, engagements, stepper, activity log | |
| 3 Discovery questionnaire, evidence | |
| 4 Rubrics, audit, scoring, scorecard | |
| 5 Opportunities, recommendation library, roadmap | |
| 6 Report preview and PDF | |
| 7 Leads pipeline and website intake | |
| 8 Hardening and first real client | |
