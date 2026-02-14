# Reader Engine

**Date:** 2026-02-14
**Participants:** lilbunnyrabbit, Claude
**Related:** [Token System Design](/docs/brainstorm/2026-02-14_token-system-design.md), [Emotion System](/docs/brainstorm/2026-02-14_emotion-system.md)

## Context

The reader engine is the runtime that displays a Speed Book to the reader — showing words one at a time with emotion-driven styling, effects, animations, background changes, and ghost words. We need to decide how this is technically implemented.

---

## 1. Word Display — DOM Element Swapping

**Decision:** Each new word is a new DOM element that enters while the old one exits. Svelte's `{#key}` block + `transition:` directives handle this natively.

Why not single-element content swap:
- CSS transitions don't trigger on text content changes
- Svelte transitions are purpose-built for enter/exit animations
- Each word's entrance/exit is defined by its emotion — this maps directly to Svelte `in:/out:` directives
- Clean separation between outgoing and incoming word

```svelte
{#key currentTokenIndex}
  <span
    in:entrance={tokenEntranceParams}
    out:exit={tokenExitParams}
    style={tokenStyles}
  >
    {currentToken.value}
  </span>
{/key}
```

---

## 2. Animation Technology — Right Tool for Each Job

| What | Technology | Why |
|------|-----------|-----|
| **Word entrance/exit** | Svelte `in:/out:` transitions | Built for this. Custom transition functions can implement any effect (fade, pop, shake-in, etc.) |
| **Ongoing effects** | CSS `@keyframes` (looping) | GPU-accelerated, declarative, no JS overhead. Applied as a class based on emotion. |
| **Background changes** | CSS `filter: brightness()` + CSS `transition` | Smooth interpolation between brightness levels. Patterns via overlay elements. |
| **Style interpolation** | Pre-computed per token | The 2D emotion grid interpolation runs once on document load. Reader just applies resolved style values. |

---

## 3. Timing — requestAnimationFrame

**Decision:** Use `requestAnimationFrame` with a time accumulator instead of `setInterval`.

Why not `setInterval`:
- Drifts under load — not guaranteed to fire on time
- At 600 WPM (100ms per word) and 1200 WPM (50ms per word), drift becomes visible
- Browser throttles timers in background tabs

`requestAnimationFrame` approach:
```
let accumulated = 0

function tick(timestamp) {
  const delta = timestamp - lastTimestamp
  accumulated += delta

  while (accumulated >= currentTokenDuration) {
    accumulated -= currentTokenDuration
    advanceToNextToken()
  }

  requestAnimationFrame(tick)
}
```

Benefits:
- Syncs with display refresh rate
- Self-correcting — no drift accumulation
- `while` loop catches up if a frame is missed
- Each token's duration is pre-computed (base WPM × emotion duration multiplier × punctuation modifier)

---

## 4. Pre-Computation

**Decision:** Pre-compute all token styles on document load.

When a Speed Book is loaded:
1. Parse all tokens
2. For each token, resolve its emotion (x, y, delivery) through the 2D grid interpolation
3. Calculate the resolved raw style values (fontWeight, fontSize, opacity, duration, entrance, exit, effect, background, etc.)
4. Store the resolved styles alongside each token
5. At runtime, the reader just reads pre-computed values — no math per frame

For a 10-15 minute Speed Book at 300 WPM (~3000-4500 tokens), this is trivial. Runs once, uses negligible memory.

---

## 5. High WPM Animation Scaling

**Decision:** Animation duration is proportional to display time — natural degradation, no thresholds.

```
animationDuration = effectiveDisplayTime × animationRatio
```

Where `animationRatio` is a fraction (e.g., 0.3 = 30% of display time for entrance).

| WPM | Display Time | Animation (30%) | Result |
|-----|-------------|-----------------|--------|
| 200 | 300ms | 90ms | Smooth, fully visible |
| 300 | 200ms | 60ms | Clear, natural |
| 600 | 100ms | 30ms | Quick but perceptible |
| 1000 | 60ms | 18ms | Very brief, almost instant |
| 1200 | 50ms | 15ms | Effectively instant |

**Key insight:** Static style properties (font weight, size, opacity, background brightness) always apply instantly regardless of WPM — they're just CSS values. Only motion/transition effects scale with time. So even at 1200 WPM, the emotional styling is fully visible; only the entrance/exit animations compress.

Ongoing looping effects (shake, bounce, breathe) naturally lose impact at high WPM since the word isn't displayed long enough for a full cycle — this is acceptable and expected behavior.

---

## 6. Ghost Words

- Rendered as separate DOM elements flanking the current word
- Configurable count (reader setting, default 3)
- **Upcoming ghost words:** Always neutral styling, just faded (avoid spoiling emotional impact)
- **Previous ghost words:** Faint hint of their emotion styling (already experienced by reader)
- Opacity decreases with distance from current word (e.g., ghost[1] = 0.4, ghost[2] = 0.25, ghost[3] = 0.15)
- No animations on ghost words — static, just position and opacity updates

---

## 7. Background System

Background changes (brightness, patterns, animations) affect the whole reading viewport:

- **Brightness:** CSS `filter: brightness(x)` on the reader container, with CSS `transition` for smooth changes between tokens
- **Patterns:** Overlay `<div>` with CSS background patterns (noise, grain), opacity controlled by emotion
- **Vignette:** CSS `box-shadow: inset` or radial gradient overlay
- Background transitions should be smoother/slower than word transitions — maybe a separate, longer transition duration so the background doesn't flicker at high WPM

---

## 8. Accessibility

- **`prefers-reduced-motion`:** Disable motion effects (shake, bounce, etc.), use instant transitions. Emotion styling (weight, size, opacity) still applies.
- **Pause on focus loss:** Stop playback when tab loses focus (optional reader setting)
- **Screen reader support:** Provide a non-RSVP text alternative
- **Keyboard controls:** Play/pause (Space), step forward/back (arrows), speed adjust

---

## Key Takeaways

1. **Svelte `{#key}` + transitions** for word enter/exit — native, clean, purpose-built
2. **CSS `@keyframes`** for ongoing effects — GPU-accelerated, no JS needed
3. **`requestAnimationFrame`** with time accumulator for timing — accurate, self-correcting
4. **Pre-compute all styles on load** — no per-frame math, trivial memory cost
5. **Proportional animation scaling** — `duration × ratio`, natural degradation at high WPM
6. **Ghost words are static/neutral** — no animations, decreasing opacity with distance
7. **Background transitions are slower** than word transitions to avoid flicker

## Resolved Decisions

| Decision | Details |
|----------|---------|
| Word display | DOM element swapping via Svelte `{#key}` + transitions |
| Animation tech | Svelte transitions (enter/exit), CSS @keyframes (ongoing), CSS filters (background) |
| Timing | `requestAnimationFrame` with time accumulator |
| Style computation | Pre-computed on document load |
| High WPM handling | Proportional animation duration — `displayTime × 0.3` ratio, no thresholds |
| Ghost words | Separate elements, neutral styling, decreasing opacity |
| Background | CSS filter + overlays, slower transitions than word swap |
| Accessibility | `prefers-reduced-motion`, keyboard controls, pause on focus loss |

## Open Questions

- Exact `animationRatio` value (0.3? 0.25? Needs testing)
- Should background transition duration be fixed (e.g., 500ms) or also proportional to WPM?
- How to split display time between entrance, hold, and exit (e.g., 30% entrance, 50% hold, 20% exit?)
- Should the reader support a "traditional reading" mode (full text with emotion styling, no RSVP)?

## Action Items

- [ ] Prototype Svelte `{#key}` word swapping with custom transitions
- [ ] Build `requestAnimationFrame` timing loop
- [ ] Implement bilinear interpolation for emotion grid → resolved styles
- [ ] Test animation scaling at various WPM values
- [ ] Implement ghost word rendering with opacity gradient
