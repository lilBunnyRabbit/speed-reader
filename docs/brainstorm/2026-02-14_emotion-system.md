# Emotion System Design

**Date:** 2026-02-14
**Participants:** lilbunnyrabbit, Claude
**Related:** [Token System Design](/docs/brainstorm/2026-02-14_token-system-design.md)

## Context

From the token system session, we established that **raw styles are the primitives and emotions are named presets**. Now we need to define the actual emotion set — what emotions exist, how each maps to raw styles, and how combinations work.

The original brainstorming had 17 flat emotions, but some overlapped (Excited vs Excited Urgent, Laughing vs Happy) and "Angry + Sad" was already a combination. We needed a cleaner, more systematic approach.

---

## 1. The Problem With a Flat Emotion List

The original 17 emotions had issues:
- **Overlaps:** Excited vs Excited (Urgent), Happy vs Laughing, Serious vs Confident
- **Inconsistencies:** "Whisper" is a delivery style, not an emotion. "Angry + Sad" is already a combination.
- **Scalability:** Adding emotions to a flat list leads to 30, 50, 100... and N emotions = N*(N-1)/2 possible pairs for combinations.

---

## 2. The Circumplex Model

Based on the psychological **Circumplex Model of Emotion**, every emotion can be mapped on two axes:

- **Valence (X axis):** How positive or negative the emotion feels (0.0 = negative, 1.0 = positive)
- **Energy/Arousal (Y axis):** How much energy the emotion has (0.0 = low, 1.0 = high)

This means an emotion is simply **a point on a 2D grid**. The raw styles for any emotion are calculated from its position.

---

## 3. The 2D Emotion Grid

### Core Insight: Emotion = Position, Styles = Interpolation

Define raw style values at the **4 corners** of the grid. Any point interpolates between them using **bilinear interpolation**:

```
                    HIGH ENERGY (y=1)
                         |
    ┌────────────────────┬────────────────────┐
    │  ANGRY CORNER      │    EXCITED CORNER   │
    │  bold (800)         │    bold (700)        │
    │  large (1.4x)       │    large (1.3x)      │
    │  fast (0.5x dur)    │    fast (0.6x dur)   │
    │  condensed          │    expanded          │
    │  shake effect       │    bounce effect     │
    │  dark bg (0.7)      │    bright bg (1.2)   │
    │  full opacity (1.0) │    full opacity (1.0)│
    │                     │                     │
 N  │                     │                     │  P
 E  │         ● Tense     │    ● Happy          │  O
 G  │                     │                     │  S
 A  ├──────── ● center ───┤── (neutral) ────────┤  I
 T  │           (no emotion)                    │  T
 I  │                     │                     │  I
 V  │         ● Sad       │    ● Calm           │  V
 E  │                     │                     │  E
    │  SAD CORNER         │    CALM CORNER       │
    │  thin (300)          │    regular (400)     │
    │  small (0.8x)        │    normal (1.0x)     │
    │  slow (2.0x dur)     │    slow (1.5x dur)   │
    │  normal spacing     │    expanded          │
    │  drop effect        │    breathe effect    │
    │  dark bg (0.8)      │    normal bg (1.0)   │
    │  low opacity (0.6)  │    full opacity (0.9)│
    └────────────────────┴────────────────────┘
                         |
                    LOW ENERGY (y=0)
```

### Corner Style Definitions

| Property | Angry (0,1) | Excited (1,1) | Sad (0,0) | Calm (1,0) |
|----------|-------------|---------------|-----------|------------|
| fontWeight | 800 | 700 | 300 | 400 |
| fontSize | 1.4x | 1.3x | 0.8x | 1.0x |
| duration | 0.5x | 0.6x | 2.0x | 1.5x |
| letterSpacing | condensed | expanded | normal | expanded |
| effect | shake | bounce | drop | breathe |
| background brightness | 0.7 | 1.2 | 0.8 | 1.0 |
| opacity | 1.0 | 1.0 | 0.6 | 0.9 |

Any point on the grid interpolates these values. Center (0.5, 0.5) = neutral/default styles.

### Intensity

Intensity is naturally built into the grid — the **further from center** a point is, the more intense the emotion. Center = no emotion. Edges = maximum expression.

---

## 4. Named Emotions (Preset Points)

Named emotions are pre-saved coordinates on the grid. They serve as quick-access bookmarks:

| # | Emotion | X (valence) | Y (energy) | Emoticon | Description |
|---|---------|-------------|------------|----------|-------------|
| 1 | Angry | 0.10 | 0.90 | 😡 | Force and intensity; word is yelling |
| 2 | Excited | 0.90 | 0.90 | 😃 | Energetic and fun; jumping off the page |
| 3 | Scared | 0.20 | 0.80 | 😨 | Nervous, fragile, jittery |
| 4 | Surprised | 0.50 | 0.95 | 😮 | Abrupt and unexpected; bursts onto page |
| 5 | Happy | 0.80 | 0.60 | 😊 | Warm and joyful; life without overwhelm |
| 6 | Tense | 0.20 | 0.60 | 😬 | Anxiety; constrained, building unease |
| 7 | Curious | 0.60 | 0.50 | 🧐 | Playful, inquisitive, leaning in |
| 8 | Sad | 0.15 | 0.20 | 😢 | Melancholy; heavy, falling into place |
| 9 | Calm | 0.85 | 0.20 | 😌 | Peaceful; rhythmic breathing-like timing |
| 10 | Tired | 0.40 | 0.10 | 😴 | Droopy, slow, almost exhausted |

### What Happened to the Original 17?

The old emotions map to this system as follows:

| Old Emotion | New Equivalent |
|-------------|---------------|
| Angry | Preset #1 (0.10, 0.90) |
| Shy | Shy delivery modifier on any emotion |
| Excited | Preset #2 (0.90, 0.90) |
| Sad | Preset #8 (0.15, 0.20) |
| Happy | Preset #5 (0.80, 0.60) |
| Scared | Preset #3 (0.20, 0.80) |
| Excited (Urgent) | Preset #2 at extreme intensity (0.95, 0.95) |
| Confident | Confident delivery modifier |
| Surprised | Preset #4 (0.50, 0.95) |
| Calm | Preset #9 (0.85, 0.20) |
| Tense | Preset #6 (0.20, 0.60) |
| Curious | Preset #7 (0.60, 0.50) |
| Whisper | Whisper delivery modifier on any emotion |
| Serious | ~(0.35, 0.45) + Confident modifier |
| Laughing | Preset #5 at strong intensity (0.85, 0.75) |
| Tired | Preset #10 (0.40, 0.10) |
| Angry + Sad | Combination: avg of #1 and #8 = (0.125, 0.55) |

---

## 5. Delivery Modifiers (1D Scale)

Delivery changes **how** an emotion is expressed, not **what** the emotion is. It's a separate 1D slider:

```
Whisper ◄━━━━━━━━━●━━━━━━━━━► Shout
   -1.0          0.0          +1.0
```

| Property | Whisper (-1.0) | Neutral (0.0) | Shout (+1.0) |
|----------|----------------|---------------|--------------|
| fontSize | -0.3x modifier | no change | +0.3x modifier |
| fontWeight | -200 modifier | no change | +200 modifier |
| entrance speed | slow | normal | fast/aggressive |
| exit speed | soft fade | normal | sharp cut |
| opacity | -0.2 modifier | no change | no change |
| effect intensity | dampened | normal | amplified |

Delivery modifiers are applied **on top of** the interpolated grid values. So "Angry + Whisper" = angry raw styles, made smaller/lighter/softer. "Calm + Shout" = calm raw styles, made larger/bolder/faster.

Named delivery presets for the dropdown:

| Modifier | Delivery Value | Emoticon |
|----------|---------------|----------|
| Whisper | -0.8 | 🤫 |
| Shy | -0.5 | 😳 |
| Neutral | 0.0 | — |
| Confident | +0.5 | 😎 |
| Shout | +0.8 | 📢 |

---

## 6. Emotion Combinations

Since emotions are coordinates, combining them is trivial — **average the X and Y values**:

```
Emotion A (xa, ya) + Emotion B (xb, yb) = Combined ((xa+xb)/2, (ya+yb)/2)
```

### Examples

| Combination | Emotion A | Emotion B | Result Point | Feels Like |
|-------------|-----------|-----------|-------------|------------|
| Angry + Sad | (0.10, 0.90) | (0.15, 0.20) | (0.125, 0.55) | Frustrated — mid energy, very negative |
| Excited + Scared | (0.90, 0.90) | (0.20, 0.80) | (0.55, 0.85) | Thrill — high energy, neutral valence |
| Happy + Tense | (0.80, 0.60) | (0.20, 0.60) | (0.50, 0.60) | Nervous excitement — mid everything |
| Calm + Sad | (0.85, 0.20) | (0.15, 0.20) | (0.50, 0.20) | Melancholy peace — low energy, neutral |
| Angry + Excited | (0.10, 0.90) | (0.90, 0.90) | (0.50, 0.90) | Intense/manic — high energy, neutral |

### Weighted Combinations

For more control, authors can weight the blend:

```
Angry (0.7 weight) + Sad (0.3 weight) = (0.10*0.7 + 0.15*0.3, 0.90*0.7 + 0.20*0.3) = (0.115, 0.69)
```

This leans more angry than sad — high-mid energy, very negative. More "furious grief" than balanced frustration.

---

## 7. The Emotion Picker UI

### Concept: Like a Browser Color Picker

The editor's emotion picker would be a 2D canvas:

```
┌──────────────────────────────────────┐
│  Emotion Grid                        │
│  ┌────────────────────────────┐      │
│  │         ● Angry    ● Surp  │      │
│  │    ● Scared                │      │
│  │         ● Tense   ● Happy  │      │
│  │              ◉ ← draggable │      │
│  │         ● Sad     ● Calm   │      │
│  │                   ● Tired  │      │
│  └────────────────────────────┘      │
│                                      │
│  Delivery: Whisper ◄━━━●━━━► Shout   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Preview: "Example word"     │    │
│  │  (live preview of styling)   │    │
│  └──────────────────────────────┘    │
│                                      │
│  Quick presets: 😡 😃 😨 😮 😊 😬 🧐 😢 😌 😴│
│                                      │
│  [Save as custom preset]             │
└──────────────────────────────────────┘
```

**Interaction:**
1. Click/drag on the 2D grid to pick an emotion position
2. Adjust the delivery slider (whisper ↔ shout)
3. See live preview of how the word looks and animates
4. Click a quick preset button for common emotions
5. Save the current position as a named custom preset

### Token Data

Each token stores just 3 values for its emotion:
```
emotion: {
  x: 0.10,       // valence (0 = negative, 1 = positive)
  y: 0.90,       // energy (0 = low, 1 = high)
  d: 0.0         // delivery (-1 = whisper, +1 = shout)
}
```

Or references a named preset:
```
emotion: "angry"  // resolves to { x: 0.10, y: 0.90, d: 0.0 }
```

---

## 8. Effects Per Grid Region

Motion effects could also be interpolated, but some effects are qualitatively different (shake vs bounce vs drop vs breathe). One approach:

Each quadrant has a **primary effect**, and the interpolation blends between them:

| Quadrant | Primary Effect |
|----------|---------------|
| Top-Left (High energy, Negative) | Shake/jolt |
| Top-Right (High energy, Positive) | Bounce/pop |
| Bottom-Left (Low energy, Negative) | Drop/sag |
| Bottom-Right (Low energy, Positive) | Breathe/pulse |

At the edges between quadrants, effects could crossfade or the dominant one wins. At the center (neutral), no effect.

---

## Key Takeaways

1. **Emotion = a point on a 2D grid** (valence × energy), not a selection from a flat list
2. **Raw styles are calculated by bilinear interpolation** from 4 corner definitions
3. **Intensity is built in** — distance from center = intensity
4. **Delivery is a separate 1D slider** (whisper ↔ shout) applied on top
5. **Combinations = average the coordinates** — trivial math, infinite expressiveness
6. **10 named presets** as quick-access bookmarks on the grid
7. **Custom emotions** are just saved points — no separate system needed
8. **Emotion picker UI** = 2D canvas + delivery slider + live preview
9. **Token stores 3 values**: x, y, delivery (or a preset name that resolves to these)
10. **The old 17 emotions all map to this system** — nothing is lost, everything is gained

## Resolved Decisions

| Decision | Details |
|----------|---------|
| Emotion model | 2D Circumplex grid (valence × energy) |
| Style calculation | Bilinear interpolation from 4 corner definitions |
| Delivery modifiers | 1D slider (whisper ↔ shout), applied on top of grid values |
| Combinations | Average coordinates (optionally weighted) |
| Named emotions | 10 preset points on the grid |
| Custom emotions | Saved points on the grid (per-book or per-author) |
| Emotion picker UI | 2D canvas + delivery slider + live preview + quick presets |

## Open Questions

- Exact corner values for all raw style properties (needs prototyping and visual testing)
- How do motion effects blend between quadrants? (Crossfade? Dominant wins? Author picks?)
- Should the delivery slider have more granularity? (Maybe 2D delivery too? Probably overkill)
- How does the 2D grid render visually in the picker? (Gradient background? Labeled regions? Just dots for presets?)
- Do we need a "no emotion" / "neutral" explicit state, or is center (0.5, 0.5) sufficient?

## Action Items

- [ ] Prototype the 2D grid picker UI
- [ ] Define exact corner raw style values (test visually)
- [ ] Build the interpolation math
- [ ] Map the 10 named presets to precise coordinates
- [ ] Design the delivery modifier math (how it layers on grid values)
- [ ] Test emotion combinations visually — do averaged points feel right?
