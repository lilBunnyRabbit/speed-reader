# Competitive Analysis: Does Something Like Speed Books Already Exist?

**Date:** 2026-02-14
**Participants:** lilbunnyrabbit, Claude
**Status:** Resolved

## Context

Before investing further in the Speed Books vision, we needed to answer a fundamental question: does something like this already exist? The concept has several distinct layers, so we researched competitors across each one.

## Key Finding

**Nothing combines all four layers of Speed Books.** The combination of RSVP presentation + author-controlled per-word emotions + visual text effects + short-form publishing platform is genuinely novel.

---

## Layer 1: RSVP Speed Reading Tools

The base mechanic (showing one word at a time at configurable WPM) is called **RSVP — Rapid Serial Visual Presentation**.

| Tool | Status | What It Does | Key Differentiator |
|------|--------|-------------|-------------------|
| **Spritz** | Active (~$5.1M revenue) | ORP (Optimal Recognition Point) — highlights specific letter in red for eye alignment | Best research behind eye fixation |
| **Spreeder** | Active ($37-67/mo) | RSVP + training courses + comprehension analytics + 20K free ebooks | Most full-featured training ecosystem |
| **SwiftRead** | Active (Chrome ext) | RSVP overlay on any webpage, supports PDFs/ePubs/Kindle | Zero-friction — select text, right-click, read |
| **Bionic Reading** | Active | Bolds first letters of words for fixation points (not RSVP) | Different approach — modifies static text display |
| **AccelaReader** | Active (free) | Minimal RSVP with adaptive speed (slows for longer words) | Adaptive pacing concept relevant to emoties |
| **Reedy** | Active (Chrome ext) | RSVP with adaptive pacing by word complexity and punctuation | Smart punctuation handling |
| **Sprint Reader** | Active (Chrome ext) | Basic RSVP, up to 1800+ WPM | Simple, free |
| **Outread** | Active (iOS) | RSVP + guided highlighting + training exercises | Multi-technique approach |
| **Librera Reader** | Active (Android) | Full ebook reader with built-in RSVP mode | RSVP integrated into ebook ecosystem |

**Summary:** Crowded space, but every tool is a **pure utility** — paste/import text and read faster. None have an authoring/creation side. None allow per-word pacing or emotion. Speed Books moves from "speed reading as utility" to "speed reading as authored experience."

---

## Layer 2: Expressive/Emotional Text

This is where Speed Books has the most unique positioning.

| Tool | Type | What It Does | Relevance |
|------|------|-------------|-----------|
| **Ren'Py** | Visual novel engine | Per-word tags: `{shake}`, `{wave}`, `{cps=20}`. Community extensions add slow_fade, bounce, etc. | **Closest to emoties conceptually** — but requires building a full game in Python |
| **Naninovel** | Unity VN engine | Per-character reveal animations, formatting tags | Requires Unity — way too heavy for web authoring |
| **SSML** | W3C standard (audio) | Per-word emotion markup for text-to-speech: emphasis, pitch, rate, pauses, emotions | **The audio equivalent of emoties** — proves the concept works. Nobody has made a "visual SSML" |
| **Novel Effect** | iOS/Android app | Listens to read-aloud and plays synchronized sound effects | Per-word emotional enhancement for audio — validated across demographics |

**Summary:** No tool exists that lets authors annotate text with per-word visual emotions for a reading experience. The concept of a "visual SSML" — an authoring tool where you tag each word with emotions affecting visual display during RSVP reading — is genuinely novel.

---

## Layer 3: Interactive/Dynamic Storytelling

| Platform | Status | What It Does | Threat Level |
|----------|--------|-------------|-------------|
| **Galatea (Inkitt)** | Active, $16M+ funded | "World's first immersive reading app." 15-min episodes with sound, haptics, visual effects. 60M+ chapters/month | **HIGH** — Closest overall vision. But effects added by production team, not authors. Text display is static. No RSVP. |
| **Storiaverse** | Active (2024 launch) | "Read-watch" format: swipe for animation, tap for text. HarperCollins partnership | **MEDIUM** — Requires professional animators. Different format. |
| **Twine** | Active | Interactive branching fiction. Node-based editor. 32K+ games on itch.io | LOW — Controls story structure, not text presentation |
| **Ink (Inkle)** | Active | Narrative scripting language for branching stories | LOW — Story flow, not text presentation |
| **Kinetic Typography** | Various tools | Animated text for video production (After Effects, Renderforest) | LOW — Video output, not interactive reading |
| **Shorthand** | Active | Scrollytelling for journalism/marketing | LOW — Not fiction, not RSVP |

**Summary:** Galatea is the biggest competitor conceptually. They've proven "immersive reading" is commercially viable and funded. But their critical weakness: effects require a production team. Speed Books puts authoring power in the writer's hands.

---

## Layer 4: Short-Form Reading Publishing

| Platform | Status | Notes |
|----------|--------|-------|
| **Wattpad** | Active, 94M+ users | Dominant community, zero reading innovation. Traditional text. |
| **Kindle Vella** | **DEAD** (Dec 2025) | Amazon's serial fiction — shut down. Plain text couldn't differentiate. |
| **Radish Fiction** | **DEAD** (Dec 2025) | Serialized "bingeable" fiction — shut down after ~decade. |
| **Tapas** | Active (Kakao subsidiary) | Primarily comics (80%), prose is secondary. Traditional text for prose. |
| **Webnovel** | Active (Tencent) | Massive library, paid per-chapter. Zero text presentation innovation. |
| **Hooked/Yarn** | Declining/Active | "Chat fiction" — stories as text messages. Proved format innovation drives engagement with young audiences. |
| **Episode/Choices** | Active, 100M+ downloads | Gamified interactive fiction with visuals. Games with text, not text with expression. |

**Summary:** The market is contracting — Kindle Vella and Radish both died in 2025. The survivors compete on community and content volume. **Plain-text serial fiction platforms cannot differentiate enough to survive.** This validates Speed Books' approach of experience differentiation.

---

## Key Lessons for Speed Books

1. **From Galatea:** Bite-sized 15-minute episodes work. Immersive reading is funded and validated. But making it author-accessible (vs. production team) is the differentiator.
2. **From Ren'Py:** Per-word inline tag syntax works and authors want these features. Emoties should feel this intuitive.
3. **From Kindle Vella / Radish deaths:** Plain-text platforms can't survive on content alone. Experience differentiation is critical.
4. **From AccelaReader / Reedy:** Adaptive pacing (different timing per word) is valued even algorithmically. Author-intentional pacing will be more powerful.
5. **From SSML:** A standardized markup for per-word emotion is viable. Speed Books' emoties are the visual equivalent.
6. **From Hooked / Chat Fiction:** Reimagining how text appears on screen creates massive engagement with young audiences.
7. **From Novel Effect:** Per-word emotional enhancement is validated across demographics (even children's read-aloud).

## Competitors to Watch

| Competitor | Threat | Why |
|------------|--------|-----|
| **Galatea (Inkitt)** | HIGH | Closest vision, $16M+ funded, 60M+ chapters/month. Weakness: requires production team. |
| **Storiaverse** | MEDIUM | HarperCollins partnership, "read-watch" hybrid. Weakness: requires animators. |
| **Ren'Py** | LOW (inspiration) | Proves per-word emotional markup works. Not a competitor — it's a game engine. |
| **Wattpad** | LOW | Could add RSVP features, but massive platform inertia. |

## Resolved Decisions

1. **The concept is novel** — no existing product combines RSVP + per-word emotion authoring + visual effects + publishing platform
2. **Market timing is good** — Kindle Vella and Radish closures (2025) create opportunity and validate the need for experience differentiation
3. **Galatea validates the market** — "immersive reading" is funded and growing, but their production-team model leaves room for an author-empowering alternative
4. **RSVP is the right base** — crowded utility market, but nobody has made it expressive

## Open Questions

- How does Speed Books differentiate from Galatea in messaging/positioning?
- Is there a way to make emoties interoperable (export format, standard)?
- Should Speed Books support traditional (non-RSVP) reading as a fallback mode?
