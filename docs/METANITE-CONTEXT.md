# Metanite Marketing: context brief

Purpose of this file: a single source of truth about Metanite for anyone (or any AI) building software for or around it. Status as of November 2026. Items marked **ASSUMED** or **OPEN** are not confirmed by the owner.

## 1. What Metanite is

**Metanite Marketing** is a strategic marketing leadership business based in **Melbourne, Australia**, serving clients in Australia and internationally. It is brand-led: the company carries the authority, and the founder is a supporting presence.

- **One-line positioning:** Strategic marketing leadership for businesses built to last.
- **What it does:** Metanite develops the marketing strategy, selects specialist agency partners, coordinates them, and keeps every channel pointed in one direction, so the client can focus on running the business.
- **Core idea ("one direction"):** Most marketing is a pile of agencies pulling different ways. Metanite makes it one plan with one owner.
- **Tagline used on site:** "Clear direction. Lasting brand value."
- **Contact email:** metanitemarketing@gmail.com
- **Domain:** metanitemarketing.com.au (**ASSUMED / OPEN**: confirm it is the registered domain)
- **Founder:** Manjil Shrestha, digital marketer and branding expert with 5+ years of experience. Founded Metanite to focus on deeper strategy and tie marketing activity to business purpose.

## 2. Who it is for (target customers)

- Owners and leaders of **family-led, multi-generational businesses**.
- Owners of **professional-services firms and clinics**.
- Markets: Australia and international.
- Traits: operations-focused, time-poor, sceptical of agencies. Many arrive after a **referral** or a **LinkedIn** post and then check the website; **Google search (SEO)** is the third acquisition channel.

## 3. The offer ladder (confirmed November 2026)

This replaces all earlier pricing. The old "AUD $1,500 strategy fee plus 15% of marketing budget" model is **retired** and must not be published or built into software.

| Step | Offer | Price | How a client enters |
|---|---|---|---|
| 1 | **Free online channel audit** (lead magnet) | Free | Self-serve form: website URL plus channels; client is meant to be emailed a report |
| 2 | **Strategic Marketing Playbook** | **AUD $15,000** (currency **ASSUMED**; owner to confirm). Scope and tax confirmed in a proposal | Apply via form (`/apply/?interest=playbook`) |
| 3 | **Strategic Partnership** | **Price is deliberately never published** | Application-style form, then a consultation call for suitable applicants |

### Step 1: Free channel audit
Reviews how a business shows up across its online channels and where the gaps are. Channels offered in the form: Website, Google search and Maps, LinkedIn, Instagram, Facebook, YouTube or video, Paid advertising, Email marketing. **The automated report generation is NOT built yet.** Today the form only delivers the request to the owner's inbox.

### Step 2: Strategic Marketing Playbook
A written, fixed-fee marketing strategy: review of current marketing, brand positioning and messaging, prioritised growth roadmap, objectives and measures. Sample documents (illustrative) are on the Resources page.

### Step 3: Strategic Partnership
Metanite leads the client's marketing as a standing partner: strategy, selection of specialist agencies, coordination and review.

## 4. How the work runs (method)

Four stages, timing indicative and shaped to the business:

1. **Find the direction** (Weeks 1-4): get close to the business: customers, commercial goals, history, marketing already in motion.
2. **Bring it together** (Weeks 4-6): turn strategy into clear briefs, select specialist partners, agree how delivery is reviewed.
3. **Put the plan to work** (Months 2-6): specialists deliver while Metanite coordinates priorities, reviews quality and brings the evidence together.
4. **Build on what works** (Ongoing): refine priorities from what the work reveals; plan the next stage of brand development.

### Service areas
- **Strategy:** business and marketing review, audience and positioning framework, messaging and brand standards, prioritised roadmap.
- **Coordination:** selection of specialist agency partners, clear scopes and briefs, cross-channel planning, quality and brand consistency reviews.
- **Performance:** agreed objectives and measurement, budget-allocation visibility, monthly performance and action reviews, quarterly priorities.

### Delivery model facts (do not contradict)
- Metanite **selects new specialist agency partners**; it does **not** take over management of the client's incumbent agencies.
- Specialists deliver the creative, channel and technical work; Metanite leads strategy and coordination.
- Partners that don't deliver the required results are **replaced**, with Metanite managing the transition.
- The client sets commercial goals and approves scope, investment and the approval framework.
- **Never imply guaranteed results.**

## 5. Evidence and honesty rules

- **No confirmed client results, testimonials or logos exist.** Never invent them.
- The homepage case study ("A family-run distributor, pointed one way": enquiries 14 to 31, priority-audience share 22% to 48%, cost per qualified enquiry A$410 to A$265, owner coordination time 6 to 1 hrs/week) is **placeholder demo data**, labelled "Illustrative example", and switchable via `SHOW_DEMO_PROOF` in `build_site.py`. Replace with verified results before launch, then remove the label.
- Forms must never claim success that the provider has not confirmed.
- Budget bands in the application form (Not sure, under $5k, $5-10k, $10-20k, $20-50k, $50-100k, $100k+ AUD) are intake options only; do not describe fee percentages or budget handling publicly.

## 6. Brand and design

- **Personality:** bold, high-energy growth partner with authority; cinematic and immersive.
- **Colours:** ink `#0a0f0a` (ground), electric/signal green `#00ed17` (identity), bone paper `#f2f4ed` (long reading); supporting ink-2 `#111a11`, ink-3 `#1a251a`, text `#e8eee3`, muted `#9fae9b`.
- **Type:** Bricolage Grotesque (display, weight ~780, tight tracking) and Manrope (body). Both self-hosted, OFL.
- **Logo:** supplied by the owner, electric green and white wordmark "METANITE MARKETING"; used on dark grounds only. Assets: `dist/assets/metanite-logo.png`, `metanite-icon.png`, `favicon.svg`.
- **Look:** square corners (3px on controls), hairline rules, no gradient text, no glass, a canvas hero of green streaks converging into one direction as you scroll. A hero video slot is reserved for future AI-generated or stock footage.
- Full system in `DESIGN.md`; product truth in `PRODUCT.md`.

## 7. Website (what exists today)

Static site, no CMS or dashboard (owner's decision: WordPress/dashboard considered and declined). Generated by Python (standard library only).

- **Source:** `build_site.py` (copy, structure, helpers), `content/insights.json` (insight pieces), `dist/styles.css`, `dist/app.js`.
- **Build:** `python3 build_site.py` writes 13 pages to `dist/` with clean URLs (`/slug/index.html`), `.htaccess` (cPanel/Apache; `/contact/` redirects to `/apply/`), `robots.txt`, `sitemap.xml`, `form-config.js`.
- **Local preview:** `python3 -m http.server 4173 --directory dist` then open http://localhost:4173/ (also configured in `.claude/launch.json`).
- **Hosting target:** cPanel/Apache shared hosting (static upload).

### Pages
`/` Home, `/audit/` free audit form, `/playbook/` Playbook detail and price, `/partnership/` Partnership and FAQ, `/approach/` method, services and roadmap tabs, `/insights/` plus three articles, `/about/` company and founder, `/resources/` illustrative sample documents, `/apply/` application form, `/privacy/`.

### Insights (articles)
1. "Who owns the plan when you have three agencies?" (Leadership)
2. "Your business has moved forward. Has your brand?" (Brand & legacy)
3. "A useful report should help you make a decision." (Marketing investment)

The owner can publish roughly **fortnightly**, but the site must **not** promise a cadence publicly.

### Forms and data
- Two forms: **audit request** and **application**. Fields include name, email, business, website, channels, budget band, a free-text message, and a honeypot spam field.
- Delivery: **FormSubmit** AJAX endpoint `https://formsubmit.co/ajax/metanitemarketing@gmail.com`, configured via `form-config.js`. **OPEN / BLOCKER:** FormSubmit activation for that inbox is not confirmed; until the owner clicks Activate in FormSubmit's email, submissions return "Email confirmation is still needed". There is no database, no CRM, no stored leads.
- If direct delivery is disabled (`DIRECT_FORM_ENABLED=False`) the form falls back to a `mailto:` link.
- No analytics or third-party trackers. Self-hosted fonts and assets. Reduced-motion is respected.

## 8. Known gaps and open decisions (useful for software scoping)

| Item | Status |
|---|---|
| Playbook currency (AUD) | Assumed, confirm |
| Production domain | Assumed `metanitemarketing.com.au`, confirm |
| FormSubmit activation | Pending owner action |
| Audit report generation | Not built (form only emails the request) |
| Real client results and testimonials | None yet; demo data in place |
| Hero video / 3D visuals | Slot reserved; assets to be supplied |
| Open Graph share image, custom 404 page | Not done |
| Founder portrait tone | Minor design issue noted in critique |
| Unused file `dist/assets/manjil-shrestha.png` (1.7 MB original) | Safe to delete |

## 9. Ideas that fit the business model (for the software you are building)

These are suggestions drawn from the model, not commitments:

- **Audit engine:** take URL + channels, pull public signals (site speed and SEO basics, Google Business profile, LinkedIn/Instagram presence), generate a branded report and email it: this is the missing piece of the free tier.
- **Lead and application pipeline:** store audit requests and applications, score fit (business type, budget band, readiness), track the path audit -> Playbook -> Partnership -> consultation call.
- **Partner/agency registry:** specialist agencies, their scopes, briefs, performance against agreed objectives, and replacement history (a core promise of the model).
- **Client engagement workspace:** the four stages, briefs, monthly review packs, quarterly priorities, spend and performance in one view.
- **Reporting:** "a report that helps you make a decision": spend, performance and business context together, with a recommended next action.
- **Constraints to respect in any software:** never publish Partnership pricing, never show guaranteed outcomes, label any demo data, keep Metanite (not the founder) as the brand voice, and keep personal data handling consistent with the privacy page.

## 10. Repository map

```
metanite-website/
  PRODUCT.md            product truth, offer ladder, evidence rules
  DESIGN.md             design system (colours, type, components, rules)
  METANITE-CONTEXT.md   this file
  build_site.py         static site generator
  content/insights.json insight summaries and article bodies
  dist/                 generated site + styles.css, app.js, assets
  .impeccable/          design contract (surface brief), design.json
  .claude/launch.json   local preview server config
```

Latest commit at time of writing: `10bd96d` (redesign around the three-step offer ladder).
