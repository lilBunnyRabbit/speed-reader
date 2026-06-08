# Backend Language Reconsideration

**Date:** 2026-04-17
**Participants:** User, Claude

## Context

Revisiting the tech stack (see `2026-02-15_tech-stack-hosting.md`) — user raised whether SvelteKit requires a JS/TS backend, or if the backend could be written in another language like Go.

User has a strong preference against JS/TS on the backend and was exploring whether splitting the stack was viable.

## Discussion

### SvelteKit with Non-JS Backend — Yes, It Works

Three viable patterns:

1. **SvelteKit frontend + separate Go API** — Two independent services. SvelteKit server routes proxy to Go.
2. **SvelteKit as BFF + Go for domain logic** — SvelteKit handles auth/sessions/SSR/form actions; Go handles compute-heavy work. Usually the sweet spot.
3. **Static SvelteKit + Go serving API + static assets** — Pure SPA, simplest deploy, loses SSR.

### Deployment Cost Concern

User's concern: Vercel + SvelteKit = effectively free hosting. Adding a Go backend introduces a persistent server cost.

**Counter-options for cheap Go hosting:**
- **Google Cloud Run** — scale-to-zero, 2M req/month free tier, Go's fast cold starts (~100ms) make this ideal. Realistic low-traffic cost: $0.
- **Fly.io** — free tier with auto-stop/wake on request.
- **AWS Lambda + Go** — fully serverless, pay per invocation (cold starts + API Gateway add friction).
- **Hetzner VPS** — €4/month, not free but trivially cheap.

### The Pragmatic Path

For Speed Books specifically, the backend surface is small: auth, store/retrieve book metadata + content, payments (Phase 4). Most heavy lifting is client-side (token rendering, animation, playback).

**Decision: Start small, stay on the existing JS/TS stack for MVP.**

- Keep the tech stack from `2026-02-15_tech-stack-hosting.md` (SvelteKit + Vercel + PlanetScale + Drizzle).
- Revisit Go (likely on Cloud Run) only when a concrete workload justifies it — e.g. token pre-computation, heavy analytics, batch processing.

## Key Takeaways

- SvelteKit does not lock the backend into JS — Go is a clean option via separate service or BFF pattern.
- Deployment cost for Go is no longer a dealbreaker (Cloud Run scale-to-zero).
- For MVP, the all-JS stack is the faster and cheaper path.
- User's language preference is acknowledged but deferred — not worth splitting the stack before there's a workload that benefits from it.

## Open Questions

- What specific workload (if any) would trigger introducing Go later?
- Is token pre-computation heavy enough to warrant native-language processing, or does JS handle it fine?

## Next Session Topics

- No change to current next-session plan (auth library, scaffolding, data model).
