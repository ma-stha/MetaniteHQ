# Metanite HQ: architecture and implementation plan

Status: **Draft for owner approval.** No application code is written until this plan is approved.
Date: 2026-11-01
Owner: Manjil Shrestha (Metanite Marketing)

This document does seven things, in order: it restates the brief after reconciling it with the business context, proposes the architecture, designs the database, defines the routes, lists security rules, lays out a staged roadmap, and names the technical risks. Plain-language explanations are marked **Why** so you can follow each decision.

---

## 0. The brief, reconciled

The original prompt described a "Growth Intelligence Studio" with ten modules. The business context brief (`METANITE-CONTEXT.md`) describes a three-step offer ladder and a four-stage delivery method. These are not in conflict, but the software has to serve the business as it actually runs. The reconciled product definition:

**Metanite HQ is the internal operating system for Metanite Marketing.** It carries a business from first contact to a signed Playbook to an ongoing Partnership, and produces the documents Metanite is paid for.

Three things the original brief did not say, which change the design:

1. **Leads come from the website forms** (free audit request, application). Today they land in an inbox and are lost. The app should receive them. This is where "client management" actually starts.
2. **The Playbook is the product.** The audit, scorecard, opportunities, recommendations, roadmap and PDF are not ten separate modules. They are the chapters of one Playbook, built in sequence for one engagement. The app should present them as a guided sequence, not ten menu items.
3. **The Partnership model depends on specialist agency partners.** Metanite selects, briefs, reviews and replaces them. That registry is missing from the original brief and is core to the business promise. It is scheduled for phase 2.

### What the app is not (first version)

- Not a client portal. Clients do not log in in v1.
- Not an automated audit engine. The free audit report is still produced by a human in v1; the app just stores the request and gives the consultant a checklist.
- Not AI-powered. No paid AI APIs. Recommendations come from a reusable library the consultant curates.
- Not a CRM for the public. One workspace, invite-only accounts for the Metanite team.

### Method mapping

The prompt's method (Diagnose, Identify Opportunities, Develop Strategy, Execute, Measure, Optimise) maps onto the app like this:

| Method step | App surface | Phase |
| --- | --- | --- |
| Diagnose | Discovery, Evidence, Audit, Scorecard | 1 |
| Identify opportunities | Opportunities | 1 |
| Develop strategy | Recommendations, 90-day roadmap, Playbook PDF | 1 |
| Execute | Partner registry, briefs, engagement stages | 2 |
| Measure | Monthly review packs, objectives and measures | 3 |
| Optimise | Quarterly priorities, roadmap revisions | 3 |

---

## 1. Requirements analysis

### Users

| Role | Who | Needs |
| --- | --- | --- |
| Owner | Manjil | Everything. Manage users, delete data, export. |
| Consultant | Future team member or contractor | Work on assigned clients. Cannot delete clients or change settings. |
| Viewer | Accountant, advisor | Read-only. |

**Why roles now:** adding them later means rewriting every database rule. Three roles cost almost nothing on day one.

### Core objects (the nouns)

- **Lead**: a website form submission or a manually entered prospect. Has a stage (new, audit sent, qualified, applied, call booked, won, lost).
- **Client**: a business Metanite works with. Has contacts.
- **Engagement**: one piece of paid work for a client. Type is `playbook` or `partnership`. An engagement owns everything below.
- **Discovery**: structured business information collected at the start (customers, goals, history, current marketing, budget).
- **Evidence**: research items: uploaded files, links, notes, screenshots, each tagged to an audit dimension.
- **Audit**: the seven-dimension review. Each dimension has a score, findings, and linked evidence.
- **Scorecard**: the computed view of the audit. Not stored separately; derived from audit scores.
- **Opportunity**: a gap or growth lever found during the audit, with impact and effort ratings.
- **Recommendation**: a strategic action, linked to one or more opportunities, drawn from or added to a library.
- **Roadmap item**: a recommendation placed in a 90-day plan with an owner, month, and measure.
- **Report**: a generated snapshot of the Playbook as PDF, versioned.
- **Partner** (phase 2): a specialist agency with scopes, briefs, performance notes, and replacement history.

### The seven dimensions (proposal)

The brief says "seven-dimensional" without naming them. Proposed, drawn from the service areas in the context brief. **Confirm or rename.**

| # | Dimension | Question it answers |
| --- | --- | --- |
| 1 | Market and customer | Do they know who they serve and why those people buy? |
| 2 | Brand and positioning | Is the brand distinct, current, and consistent with where the business is going? |
| 3 | Messaging and content | Does what they say match the positioning, across every channel? |
| 4 | Channels and presence | Where are they visible, and is each channel pointed the same way? |
| 5 | Conversion and sales enablement | Does interest turn into enquiries, and do enquiries get handled? |
| 6 | Measurement and data | Can they tell what is working? |
| 7 | Capability and coordination | Who owns the plan: team, agencies, budget, governance? |

Each dimension is scored 0-100 from a rubric of five to seven criteria. The rubric is editable by the owner in settings so the method can evolve without code changes.

### Non-functional requirements

- Works well on a laptop. Usable on a tablet. Not designed for phones in v1.
- Autosave on all long forms. Losing an hour of discovery notes is unacceptable.
- Every write is attributed to a user and timestamped.
- Exportable: the owner can pull all data for a client as JSON and files as a zip.
- Demo data is clearly flagged, both in the database and on screen.

---

## 2. Architecture

### Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15, App Router, TypeScript | One codebase for UI and server logic. Server Components keep secrets off the browser. |
| Styling | Tailwind CSS v4 plus a small set of shared components | Fast to build, easy to keep consistent with design tokens. |
| Components | Radix UI primitives via shadcn/ui, restyled to the brand | Accessible dialogs, menus, tabs without writing them from scratch. |
| Database and auth | Supabase (Postgres, Auth, Storage, Row Level Security) | One service for data, login, and file uploads. RLS enforces access in the database itself. |
| Validation | Zod | One schema validates forms in the browser and again on the server. |
| Forms | react-hook-form | Autosave and validation for long discovery forms. |
| PDF | Playwright (server-side, print the report route to PDF) | The report is built once as a web page, and the PDF is that page printed. One design, two outputs. |
| Hosting | Vercel (app) plus Supabase cloud | Zero-ops. Free tiers suffice until there are several consultants. |
| Testing | Vitest (logic), Playwright (a few end-to-end flows) | Scoring maths and access rules must be tested. UI less so in v1. |

**Why not a separate backend:** a beginner maintaining one Next.js project is realistic. Maintaining Next.js plus a Node API plus a job queue is not. Next.js Server Actions and Route Handlers are the backend.

### Modular structure

```
metanitehq/
  app/                      routes (thin: pages call feature code)
    (auth)/login
    (app)/dashboard
    (app)/leads
    (app)/clients/[clientId]
    (app)/clients/[clientId]/engagements/[engagementId]/...
    (app)/library
    (app)/settings
    api/intake/             public endpoint the website forms post to
    print/report/[reportId] print-only layout used for PDF
  features/                 one folder per domain; the real code lives here
    leads/      clients/    engagements/   discovery/   evidence/
    audit/      opportunities/  recommendations/  roadmap/  reports/
    partners/   (phase 2)
      each has: actions.ts (server writes), queries.ts (reads),
                schema.ts (Zod), components/, types.ts
  components/ui/            buttons, inputs, tables, dialogs (brand-styled)
  lib/
    supabase/               server client, browser client, admin client
    scoring.ts              audit maths, pure functions, unit tested
    auth.ts                 getCurrentUser, requireRole
  supabase/
    migrations/             SQL, numbered, applied in order
    seed/                   demo data, every row flagged is_demo = true
  docs/
```

**Why features/ not app/:** route files should be boring. If the scoring logic lives next to the page that shows it, it cannot be reused by the PDF, the dashboard or a test.

### Data flow (one example)

A consultant edits an audit dimension score.

1. The form (browser) validates with the Zod schema and calls a Server Action.
2. The Server Action re-validates, checks the user's role, and writes via the Supabase server client using the user's session.
3. Postgres RLS checks the user may write to that engagement. If not, the write fails regardless of what the app code did.
4. A database trigger writes an `activity_log` row.
5. The page revalidates and the scorecard recomputes from the stored scores.

**Why two checks:** app code has bugs. RLS is the safety net under them.

---

## 3. Database schema

All tables have `id uuid primary key default gen_random_uuid()`, `created_at`, `updated_at`, `created_by`. Omitted below for brevity. All tables have RLS enabled.

```sql
-- People and access
profiles            (id -> auth.users, full_name, role: owner|consultant|viewer, is_active)

-- Pipeline
leads               (source: audit_form|apply_form|manual, stage, name, email, business_name,
                     website, channels text[], budget_band, message, interest: audit|playbook|partnership,
                     fit_score int, notes, client_id null, is_demo bool)
lead_events         (lead_id, type, note)                -- stage changes, calls, emails

-- Clients
clients             (name, website, industry, location, segment: family_business|professional_services|clinic|other,
                     status: prospect|active|paused|closed, is_demo bool)
contacts            (client_id, name, role, email, phone, is_primary)
client_members      (client_id, user_id)                 -- which consultants may see this client

-- Engagements
engagements         (client_id, type: playbook|partnership, status: scoping|discovery|audit|strategy|
                     delivered|active|closed, stage, start_date, end_date, fee_cents, currency, notes)

-- Diagnose
discovery_sections  (engagement_id, section_key, answers jsonb, completeness int, unique(engagement_id, section_key))
evidence            (engagement_id, kind: file|link|note|screenshot, title, url, storage_path,
                     dimension_key null, summary, tags text[])

audits              (engagement_id, status: draft|complete, completed_at, unique(engagement_id))
audit_dimensions    (audit_id, dimension_key, score int 0..100, summary, strengths, weaknesses, unique(audit_id, dimension_key))
audit_criteria      (audit_dimension_id, criterion_key, rating int 0..4, note)
audit_dimension_evidence (audit_dimension_id, evidence_id)

-- Identify
opportunities       (engagement_id, title, description, dimension_key, impact int 1..5, effort int 1..5,
                     priority generated, status: candidate|selected|rejected)

-- Strategy
recommendation_library (title, body, dimension_key, tags text[], is_active)   -- reusable, owner-curated
recommendations     (engagement_id, library_id null, title, body, rationale, order int)
recommendation_opportunities (recommendation_id, opportunity_id)
roadmap_items       (engagement_id, recommendation_id null, title, month int 1..3, owner_label,
                     measure, status: planned|in_progress|done)

-- Output
reports             (engagement_id, version int, title, storage_path, generated_by, snapshot jsonb)

-- Settings
rubrics             (dimension_key, criterion_key, label, description, weight, order)
activity_log        (actor_id, entity, entity_id, action, diff jsonb)

-- Phase 2
partners            (name, specialisms text[], contact, status: candidate|active|replaced|retired)
partner_assignments (engagement_id, partner_id, scope, brief_path, start_date, end_date, outcome, replaced_by null)
```

### Design notes

- **`discovery_sections.answers` is JSONB.** The discovery questionnaire will change often. Storing each section as a JSON document, validated by a Zod schema in code, means a new question is a code change, not a migration. **Why this is safe:** the structure is still enforced, just in TypeScript instead of SQL.
- **Scorecard is computed, not stored.** `score` per dimension is stored; the overall score and the red/amber/green bands are calculated in `lib/scoring.ts`. One source of truth.
- **`reports.snapshot`** stores the exact data the PDF was generated from. If the audit changes next week, version 1 of the report still shows what was sent.
- **`is_demo`** on leads and clients. The UI shows a badge; the owner can delete all demo rows with one action.
- **`client_members`** controls which consultants see which clients. The owner sees all.

### Access rules (RLS summary)

| Table group | Owner | Consultant | Viewer |
| --- | --- | --- | --- |
| profiles | all | own row | own row |
| leads | all | all | read |
| clients, contacts | all | member clients only | read all |
| engagements and children | all | member clients only | read all |
| recommendation_library, rubrics | all | read | read |
| activity_log | read | none | none |
| reports storage bucket | all | member clients only | read |

---

## 4. Routes

| Route | Purpose |
| --- | --- |
| `/login` | Email and password, magic link optional. Invite-only; no public sign-up. |
| `/dashboard` | Today: new leads, engagements by stage, overdue roadmap items, recent activity. |
| `/leads` | Pipeline board (columns by stage) and table view. |
| `/leads/[id]` | Lead detail, events, convert to client. |
| `/clients` | Client list with status and active engagement. |
| `/clients/[id]` | Client overview, contacts, engagements, files. |
| `/clients/[id]/engagements/new` | Create engagement. |
| `/clients/[id]/engagements/[eid]` | Engagement home: stepper showing Discovery, Evidence, Audit, Opportunities, Strategy, Roadmap, Report with completeness. |
| `.../discovery` | Sectioned questionnaire with autosave. |
| `.../evidence` | Upload, link, note. Filter by dimension. |
| `.../audit` | Seven tabs, one per dimension. Rubric criteria, score, findings, attached evidence. |
| `.../scorecard` | Radar plus bars, band colours, strongest and weakest, trend vs previous audit (phase 3). |
| `.../opportunities` | Impact-effort matrix and list. Select for strategy. |
| `.../strategy` | Recommendations, ordered, pulled from library or written fresh. |
| `.../roadmap` | Three-month board. |
| `.../report` | Preview, generate PDF, version history. |
| `/library` | Recommendation library management. |
| `/settings` | Users and roles, rubrics, demo data, export. |
| `/api/intake` | POST. Receives website form submissions with a shared secret. Creates a lead. |
| `/print/report/[reportId]` | Print layout. Reached only by the PDF generator with a signed token. |

### Navigation model

Left sidebar: Dashboard, Leads, Clients, Library, Settings. Inside an engagement, a horizontal stepper replaces the sidebar's second level. The stepper is the method; a consultant always knows where they are in the Playbook.

Keyboard: `Cmd+K` command palette for jumping to any client or engagement. `Cmd+S` forces save on forms.

---

## 5. Security and privacy

1. **Authentication before any data.** Supabase Auth. Sign-up disabled; owner invites by email. Session cookies are httpOnly.
2. **Row Level Security on every table.** Policies as per the table above. Tested with a script that logs in as each role and attempts forbidden reads and writes.
3. **Secrets stay on the server.** Only `NEXT_PUBLIC_SUPABASE_URL` and the anon key reach the browser (that is by design; the anon key is useless without RLS passing). The service-role key is used only in `lib/supabase/admin.ts` for the intake endpoint and PDF generation, never imported by client components. A lint rule blocks the import path from `components/`.
4. **Intake endpoint** verifies a shared secret header, rate-limits by IP, validates with Zod, strips HTML, and honours the honeypot field. It replaces FormSubmit, which resolves the open blocker in the context brief.
5. **File storage** is a private bucket. Downloads use short-lived signed URLs. Uploads are limited to PDF, images, CSV, DOCX, 25 MB.
6. **Audit trail.** `activity_log` is written by database triggers, not app code, so it cannot be skipped.
7. **Privacy (Australian Privacy Act).** Collect only what the method needs. Leads that go nowhere are purged after 12 months by a scheduled function. Client export and delete are owner actions in settings.
8. **Backups.** Supabase daily backups on the paid tier. On the free tier, a weekly `pg_dump` script is documented in the README.
9. **Dependencies.** Dependabot enabled on the repo. `npm audit` in CI.
10. **Never guarantee results.** The report template has no field for promised outcomes. Recommendations carry "expected effect" language with a mandatory assumptions line.

---

## 6. Design and UX

Tokens are in `BRAND.md`. Colours supplied by the owner (`#13e52c`, `#0f0f22`, `#f6f5f1`) supersede the website palette.

### Principles

- **Dark, quiet, precise.** The ground is near-black navy. Text is off-white. Green appears once per screen as the primary action, and in data where it means "good". It is not decoration.
- **Hierarchy by weight and space, not colour.** Bricolage Grotesque for headings at 700-780. Generous margins. Hairline borders. No shadows.
- **Numbers are the heroes.** Scores, counts and dates in tabular figures, large where they matter.
- **One obvious next step.** Every engagement screen ends with a single primary button that advances the method.

### Key screens

**Dashboard.** Four stat tiles across the top (new leads, active engagements, reports due, overdue roadmap items). Below: two columns, "Needs attention" list on the left, activity feed on the right. No charts for the sake of charts.

**Engagement home.** Client name and type as the title. A seven-step horizontal stepper with completeness percentages. Below, a two-column summary: left shows the latest scorecard mini-radar, right shows the next three roadmap items. Primary button is the next incomplete step.

**Audit.** Dimension tabs on the left (vertical). Centre: criteria rows, each with a 0-4 segmented control and a note field. The dimension score updates live at the top. Right rail: evidence attached to this dimension, drag in from the evidence list.

**Scorecard.** Radar chart (seven axes, one filled shape in green at 20% opacity) beside seven horizontal bars with band colours. Under it, "Strongest" and "Weakest" callouts with one-line summaries pulled from the audit.

**Opportunities.** A 2x2 impact-effort matrix with draggable cards, and a table beneath. Selected opportunities turn green.

**Report preview.** The report rendered as a web page with page breaks shown. Cover, executive summary, scorecard, seven dimension chapters, opportunities, recommendations, roadmap, appendix of evidence. "Generate PDF" creates a version.

### Usability rules

- Autosave with a visible "Saved 3s ago" indicator. No save buttons on long forms.
- Destructive actions require typing the client name.
- Empty states explain what the step is for and what to do first.
- Every list has search and sort. Filters persist in the URL.
- Focus states are visible green outlines. All controls reachable by keyboard.
- Colour is never the only signal: bands also show a label (Critical, Developing, Strong).

### Accessibility

WCAG 2.1 AA. The green on navy passes at 4.5:1 for large text and UI; body text uses off-white, not green. Verified with a contrast check in CI.

---

## 7. Implementation roadmap

Each stage ends with something you can open in a browser and use. Estimates assume you work with me in sessions; they are effort, not calendar.

| Stage | Deliverable | Effort |
| --- | --- | --- |
| 0 | Repo setup: Next.js, Tailwind, Supabase project, env handling, CI, README, brand tokens, UI kit (button, input, card, table, dialog, tabs) | 1 session |
| 1 | Auth, profiles, roles, invite flow, RLS foundation, app shell with sidebar and command palette, dashboard skeleton | 1-2 sessions |
| 2 | Clients, contacts, engagements, engagement stepper, activity log | 1-2 sessions |
| 3 | Discovery questionnaire with autosave; evidence upload and linking | 2 sessions |
| 4 | Rubric settings, audit, scoring engine with tests, scorecard | 2 sessions |
| 5 | Opportunities matrix, recommendation library, recommendations, roadmap | 2 sessions |
| 6 | Report preview, PDF generation, versioning | 1-2 sessions |
| 7 | Leads pipeline, intake endpoint, website form switch-over, demo data toggle, export | 2 sessions |
| 8 | Hardening: RLS tests for every role, rate limits, backups, docs; first real client | 1 session |

Phase 2 (after first real client): partner registry, briefs, monthly review packs.
Phase 3: quarterly priorities, score trends, client portal, automated free-audit report.

**Why leads are stage 7 and not stage 1:** the Playbook is the revenue. Getting one real Playbook through the app end to end proves the design. Leads can live in the inbox for a few more weeks.

---

## 8. Technical risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| RLS policy mistakes expose a client's data to the wrong consultant | Medium | Policy test script run in CI as each role. Single-tenant with few users reduces blast radius. |
| PDF generation is fiddly (fonts, page breaks, headless browser on Vercel) | High | Build the print layout first with CSS `@page` rules. Run Playwright in a Vercel function with `@sparticuz/chromium`; if that fails, fall back to a small Docker service or generate on the owner's machine. Decide in stage 6, not before. |
| Discovery questionnaire changes break old data | Medium | JSONB with versioned Zod schemas and a migration function per version. |
| Scoring feels arbitrary to clients | Medium | Rubric criteria are explicit and printed in the report appendix. Scores are evidence-linked. |
| Beginner maintainability | High | Features folder convention, every feature looks the same. README with "how to add a field" and "how to add a table" recipes. No clever abstractions. |
| Scope creep toward a full CRM or agency PM tool | High | This document is the scope. Changes go through `docs/decisions/`. |
| Supabase free tier pauses after inactivity | Low | Move to Pro before the first real client. Cost is small. |
| Vendor lock-in to Supabase | Low | It is Postgres. Schema and data export cleanly. Auth is the only sticky part. |
| Website still posts to FormSubmit | Certain until stage 7 | Keep both paths working during switch-over; intake endpoint accepts the same field names. |

---

## 9. Decisions needed from the owner

1. Approve the seven dimensions or rename them.
2. Confirm scoring scale (0-100 with 0-4 criteria ratings) or prefer a 1-10.
3. Confirm Playbook currency AUD and whether fees are tracked in the app at all.
4. Confirm the user's own colours (`#0f0f22` navy ground) over the website's `#0a0f0a` green-black. This plan assumes the navy.
5. Confirm hosting on Vercel plus Supabase cloud (region: Sydney).
6. Confirm "no client login in v1".

Reply with approvals or changes and stage 0 starts.
