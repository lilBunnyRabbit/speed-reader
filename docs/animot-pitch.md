# Animot

**"Webtoons for Books."**

---

## The Problem

Books haven't changed in centuries. Words sit on a page — static, silent, one-size-fits-all. Meanwhile, every other medium has evolved: music has dynamics, film has pacing and cinematography, comics became webtoons. Text is the last creative medium stuck in the past.

Short-form reading platforms have tried to fix this with volume (more stories, faster releases) — and they're dying. Kindle Vella shut down in December 2025. Radish Fiction died the same month. Plain text can't differentiate enough to survive.

## The Idea

Animot is a platform where stories aren't read — they're *experienced*. Words appear one at a time, at a pace the reader controls, with **author-controlled emotion, pacing, and expression** on every single word.

Think of it like directing a movie, but the medium is text:
- A whispered word fades in slowly, thin and fragile
- An angry word slams onto the screen, bold and shaking
- A tense moment builds with tighter, constrained words before a single explosive **"RUN!"** that fills the screen and vanishes

No colors, no illustrations — just words, brought to life through **font weight, size, timing, spacing, and subtle motion**. It still feels like reading a book, but with the emotional depth of a film.

## How It Works

**For readers:** Words appear one-by-one in the center of the screen (RSVP — Rapid Serial Visual Presentation). You control the speed. Ghost words provide context. Playback controls let you pause, rewind, and scrub like a video. A 10-15 minute story — a **mot** — is designed to be short, expressive, and complete.

**For writers:** You write text, then paint emotions onto words using a 2D emotion grid (valence × energy). Pick a point on the grid — or use named presets like Angry, Calm, Excited, Scared — and the platform calculates the font styling, timing, and effects automatically. A delivery slider (whisper to shout) adds another dimension. Emotions combine by averaging coordinates, giving infinite expressiveness from a simple system.

**The key insight:** Most words stay neutral. Emotions are applied to *key moments* — maybe 10% of the text. This isn't about overwhelming the reader; it's about making the moments that matter *land*.

## What Makes It Novel

We researched the landscape across four layers:

1. **RSVP speed readers** (Spritz, Spreeder, SwiftRead) — crowded, but they're all utilities. None have authoring or expression.
2. **Expressive text** (Ren'Py, SSML) — per-word markup exists in game engines and speech synthesis, but nobody has built a "visual SSML" for reading.
3. **Immersive reading** (Galatea/Inkitt — $16M+ funded, 60M+ chapters/month) — validates the market, but their effects require a production team. Animot puts authoring power in the writer's hands.
4. **Short-form publishing** (Wattpad, Tapas, Webnovel) — surviving on volume, zero text presentation innovation.

**Nothing combines all four layers.** RSVP + per-word emotion authoring + visual effects + publishing platform is genuinely new.

## The Emotion System

Built on the psychological **Circumplex Model of Emotion** — every emotion maps to a point on a 2D grid:

- **X axis:** Valence (negative → positive)
- **Y axis:** Energy (low → high)

Raw visual styles (font weight, size, duration, opacity, motion effects, background brightness) are defined at the four corners and **interpolated** for any point. 10 named presets serve as quick-access bookmarks. Custom emotions are just saved points — no separate system needed.

Combinations are trivial: average the coordinates. Angry + Sad = mid-energy frustration. Excited + Scared = high-energy thrill. Weighted blends allow fine control.

## The Tech

| Layer | Choice |
|-------|--------|
| Framework | SvelteKit |
| Hosting | Vercel |
| Database | PlanetScale (MySQL) |
| ORM | Drizzle |
| Content Storage | Object storage (CDN-cached) |
| Styling | Tailwind CSS |
| Runtime | Bun |
| Payments | Stripe Connect |

The reader engine uses **Svelte transitions** for word animations, **CSS @keyframes** for GPU-accelerated effects, and **requestAnimationFrame** for precise timing. All emotion styles are **pre-computed on load** — zero per-frame math.

## The Business

**Marketplace model** — authors set prices, readers pay directly, platform takes a percentage. Simple, proven, no virtual currency overhead.

Additional revenue paths: video export (render mots as videos for YouTube/TikTok/social), educational licensing, premium authoring tools.

## Target Audiences

- **Writers & Creators** — a new creative medium with unprecedented control over how words land
- **Readers** — short, impactful stories you can experience in 10-15 minutes
- **Educators** — bring learning materials to life with pacing and emphasis
- **Content Creators** — export to video for social platforms

## The Name

**Animot** — from *anima* (Latin: soul) + *mot* (French: word). "Words with soul." Pronounced ah-nee-MOH.

A single piece of content is a **mot** — French for "word," English for a witty remark (as in "bon mot"). The content name lives inside the platform name: Ani**mot**.

*"Read a mot on Animot."*

## Building Incrementally

| Phase | Focus |
|-------|-------|
| 1. Foundation | Core speed reader in SvelteKit (WPM, ghost words, playback) |
| 2. Expressiveness | Emotion system, per-word styling and effects |
| 3. Authoring | Editor with paint/brush mode, emotion picker, AI assistance |
| 4. Platform | Accounts, library, publishing, discovery |
| 5. Intelligence | Analytics, recommendations, collaborative editing |

---

*Don't just read stories — feel them.*
