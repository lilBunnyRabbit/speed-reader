# Tech Stack & Hosting

**Date:** 2026-02-15
**Participants:** User, Claude

## Context

With the core architecture designed (token system, emotion grid, reader engine, editor UX), it's time to decide on the concrete tech stack and hosting platform for the SvelteKit rewrite.

## Starting Position

- **Framework:** Leaning SvelteKit (not just Svelte)
- **Hosting:** Leaning Vercel

---

## Discussion

### SvelteKit vs Plain Svelte

**Decision: SvelteKit**

Reasons:
- File-based routing for multiple pages (reader, editor, library, profiles, auth)
- SSR/SSG for published books (SEO, fast first paint) while reader/editor stay CSR
- API routes (`+server.ts`) for platform phase (accounts, publishing)
- Form actions for auth, publish, settings flows
- Official Svelte meta-framework — recommended even for SPAs
- Can disable SSR per-page where not needed (`ssr: false`)

### Hosting: Vercel

**Decision: Vercel**

- First-class SvelteKit support (`@sveltejs/adapter-vercel`)
- Zero-config deploys, preview deploys per PR
- Serverless model fits well — Speed Books is client-heavy:
  - Reader: fetches book JSON once, then all client-side (animations, timing, playback)
  - Editor: client-side editing, saves on publish/autosave
  - Minimal API surface: auth, fetch book, save/publish
- Adapter system means migration is straightforward if needed later
- Cloudflare Pages noted as future alternative (cheaper at scale, edge-native) but unfamiliar territory for now

### Database: PlanetScale

**Decision: PlanetScale (MySQL-compatible serverless)**

- Already used in other projects — familiar tooling
- Serverless-friendly (HTTP-based connections, no persistent connection pooling needed)
- Schema branching for safe migrations
- Scales down to free/hobby tier for MVP, scales up for platform phase

**What PlanetScale stores:**
- User accounts & auth data
- Speed Book metadata (title, author, description, tags, published status)
- Speed Book content (the token JSON — or could be stored as files on edge/CDN?)
- Library/browse data (featured, trending, categories)
- User reading progress, bookmarks

### Content Storage: Hybrid Approach

**Decision: Metadata in DB, book content in object storage**

- Book JSON stored as files in object storage (Vercel Blob, S3, or R2)
- PlanetScale stores metadata + pointer to content file
- Reader fetches JSON once from CDN — cached at edge for fast delivery
- Supports versioning (drafts, published versions)

**Storage candidates:**
- Vercel Blob — least friction for MVP, integrated with Vercel
- Cloudflare R2 — no egress fees, better long-term if books get popular
- AWS S3 + CloudFront — classic, proven

**Reader flow:**
1. SvelteKit loads metadata from PlanetScale (SSR for SEO)
2. Client fetches book JSON from storage/CDN
3. Reader engine runs entirely client-side

### ORM: Drizzle

**Decision: Drizzle ORM**

- Lightweight, type-safe, SQL-like syntax
- Native PlanetScale support (`drizzle-orm/planetscale-serverless`)
- Schema defined in TypeScript
- Smaller bundle, faster cold starts (good for serverless)

### Auth

**Decision: Use an existing auth library (TBD which one)**

Candidates:
- **Lucia** — lightweight, framework-agnostic, good SvelteKit integration
- **Auth.js (SvelteKit)** — OAuth providers out of the box, heavier
- To be decided before implementation

### Styling: Tailwind CSS

**Decision: Tailwind CSS**

### Runtime & Tooling

- **Runtime / Package Manager:** Bun
- **Linting:** ESLint
- **Testing:** Vitest

### Monetization Model

**Decision: Marketplace model — author sets price, platform takes %**

- Author sets price per book (or free)
- Reader pays directly
- Platform takes a percentage (industry range: 10-30%)
- Simple, well-understood model — no virtual currency overhead

**Why not coins/tokens (for now):**
- Adds complexity (wallets, exchange rates, top-ups)
- Needs critical mass of content to justify
- Can always layer it on later

**Technical needs (Phase 4):**
- Stripe Connect — handles payments + author payouts + platform fee
- Price field on book metadata
- Purchase records in PlanetScale
- Gate book JSON fetch behind purchase check (free books skip this)

**Open questions (deferred):**
- Platform percentage (10%? 20%? 30%?)
- Minimum price / price tiers vs flexible pricing
- "Pay what you want" with suggested price?
- Free book strategy (promotional, limited library, etc.)

---

## Summary: Full Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | SvelteKit |
| Hosting | Vercel (`adapter-vercel`) |
| Database | PlanetScale (MySQL) |
| ORM | Drizzle |
| Content Storage | Object storage (Vercel Blob / R2 / S3) — TBD |
| Auth | Existing library — TBD (Lucia or Auth.js) |
| Styling | Tailwind CSS |
| Runtime / PM | Bun |
| Linting | ESLint |
| Testing | Vitest |
| Payments | Stripe Connect (Phase 4) |

## Key Takeaways

- Stack is serverless-friendly throughout (Vercel + PlanetScale + Drizzle)
- Client-heavy architecture — server does minimal work (auth, fetch metadata, serve pages)
- Book content lives in object storage, fetched once and cached at edge
- Marketplace monetization — author sets price, platform takes %
- Auth library to be finalized before implementation
- Content storage provider to be finalized (Vercel Blob easiest for MVP)

## Open Questions

- Which auth library? (Lucia vs Auth.js)
- Which object storage? (Vercel Blob vs R2 vs S3)
- Platform fee percentage
- Pricing model details (minimum price, pay-what-you-want, etc.)

## Next Session Topics

- Auth library comparison and decision
- Project scaffolding (SvelteKit + Bun + Tailwind + Drizzle setup)
- Data model — Drizzle schema for books, users, purchases
