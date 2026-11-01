# Metanite HQ: working rules

Read `docs/PLAN.md` before changing anything. It is the scope.

- Stack: Next.js 16 (App Router, Cache Components OFF), TypeScript strict, Tailwind v4, Supabase.
- Code lives in `features/<domain>/` (actions.ts, queries.ts, schema.ts, components/). Route files in `app/` stay thin.
- Design tokens in `app/globals.css` and `docs/BRAND.md`. Use token classes (`bg-bg-2`, `text-muted`, `text-green`). No hex values in components.
- Schema changes are SQL files in `supabase/migrations/`. Every table gets RLS and policies.
- `lib/supabase/admin.ts` bypasses RLS. Never import it from components or pages.
- Demo data rows set `is_demo = true` and the UI shows a "Demo data" badge.
- Never add fields that promise or imply guaranteed client results.
- Explain non-obvious technical decisions in a `docs/decisions/` record.
