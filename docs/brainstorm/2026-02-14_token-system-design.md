# Token System Design

**Date:** 2026-02-14
**Participants:** lilbunnyrabbit, Claude
**Related:** [Project Vision](/docs/brainstorm/2026-02-14_project-vision.md), [Competitive Analysis](/docs/brainstorm/2026-02-14_competitive-analysis.md)

## Context

The token is the fundamental unit of Speed Books. In the current React v2 implementation, tokens are minimal — just a word split from text with prefix/suffix whitespace and a basic `BOLD` emotion enum. The system needs to be redesigned from the ground up to support the full Speed Books vision: per-word emotions, pacing control, grouping, sections, and a potential authoring format.

### Current v2 Token Structure (for reference)
```typescript
interface Token {
  v: string;        // Value (the word)
  p?: string;       // Prefix whitespace
  s?: string;       // Suffix whitespace
  e?: TokenEmotion[]; // Emotions (only BOLD = 0)
  i?: number;       // Index (temporary)
}
```

---

## 1. Token Data Model

### Proposal: One token = one word

The word is the natural unit for RSVP (one word displayed at a time). Multi-word grouping should be handled at a higher level (groups/spans), not by making tokens span multiple words.

### Proposed Token Properties

```
Token {
  value       — The word itself (string)
  emotion     — An emotie ID, or null for neutral display
  duration    — Timing modifier relative to WPM (e.g., 1.5x = 50% longer)
  pause       — Pause *after* this token, in ms or as a multiplier
  emphasis    — Explicit style overrides independent of emotion (bold, italic, size)
  effects     — Motion effects independent of emotion (shake, bounce, etc.)
}
```

### Decided: Emotions Are Presets for Raw Styles

Raw style properties are the primitives. Emotions are named presets — a collection of raw style values with a name and emoticon. This means:

- Authors can style tokens with raw properties directly (bold one word without needing an emotion)
- Emotions are convenience presets that set multiple raw properties at once
- Custom emotions are just custom presets — named collections of raw style values
- An emotion applied to a token is equivalent to setting its raw styles to the preset values
- Authors can apply an emotion and then override individual properties if needed

### Raw Style Properties (Primitives)

```
TokenStyle {
  fontWeight    — normal, bold, light (or numeric 100-900)
  fontStyle     — normal, italic
  fontSize      — multiplier (e.g., 1.2x = 20% larger)
  letterSpacing — normal, condensed, expanded
  textTransform — none, uppercase, lowercase
  duration      — display time multiplier relative to WPM (e.g., 2x)
  pause         — pause after token in ms or multiplier
  effect        — motion effect (shake, bounce, pulse, drop, sag, etc.)
  effectIntensity — subtle, normal, strong
  entrance      — how the word appears (instant, fade-in, pop, expand, etc.)
  background    — background change (TBD — see open question below)
}
```

### Decided: Background Changes

Background changes are simple atmospheric adjustments — **darken/lighten** the overall background, and optionally **subtle animations** (pulse, breathing, vignette). This stays within the "no colors" principle because it's luminance-based, not color-based — like reading in changing ambient light.

Examples:
- Background darkens during a tense/angry scene
- Lightens for calm/happy moments
- Subtle pulse or breathing animation for certain emotions
- Vignette effect that tightens during fear/tension

Could also include subtle **patterns** — noise, grain, texture overlays that shift the mood without introducing color.

Added to raw style properties:
```
background {
  brightness  — multiplier on background luminance (e.g., 0.8 = 20% darker, 1.2 = 20% lighter)
  pattern     — subtle pattern overlay (none, noise, grain, static, etc.)
  animation   — background animation (none, pulse, breathe, vignette, etc.)
  animationIntensity — subtle, normal, strong
}
```

---

## 2. Authoring Format

Three approaches to how writers create and edit Speed Books:

### A) GUI-Only
Like Figma or a rich text editor. Select words, click buttons/dropdowns to assign emotions. No syntax to learn.

- **Pro:** Lowest barrier to entry, most visual, immediately intuitive
- **Con:** Slow for power users, hard to batch-edit, difficult to version control

### B) Markdown-Like Syntax
Authors write in a text format with inline markup for emotions.

Possible syntax ideas:
```
The forest was [calm]silent[/calm].
Then she heard it — [angry]**SNAP!**[/angry]
Her heart [tense]raced[/tense]... [scared]louder[/scared]... [angry]faster[/angry]...
```

Or a more concise tag syntax:
```
The forest was {calm: silent}.
Then she heard it — {angry: **SNAP!**}
```

Precedent:
- Ren'Py uses `{shake}word{/shake}` (inline open/close tags)
- SSML uses `<emphasis>word</emphasis>` (XML-style)
- Markdown uses `**bold**`, `*italic*` (delimiter wrapping)

- **Pro:** Fast for power users, portable, human-readable, version-controllable, works in any text editor
- **Con:** Learning curve, harder to visualize effects while writing

### C) Hybrid (Recommended)
Write in a rich editor that understands the syntax and renders a live preview. Like Notion, Obsidian, or VS Code with markdown preview.

- Author can type syntax directly or use GUI controls (dropdown, toolbar)
- Editor shows inline indicators (emoticons, colored underlines in edit mode)
- Side-by-side or toggle preview shows how the reader will experience it
- Raw format is the text syntax — GUI is just a layer on top

- **Pro:** Best of both worlds — accessible for beginners, fast for power users
- **Con:** Most complex to build (but can start with GUI-only, add syntax support later)

**Decision:** Start with GUI-only. The markup syntax isn't appealing right now — the long-term goal is hybrid, but no need to design a text syntax upfront. The underlying data format is JSON (see Storage section), and the editor is purely visual.

---

## 3. Emotion Assignment

How does a user say "this word is angry"?

### Proposed Methods (all can coexist in the hybrid editor)

1. **Select + Dropdown** — Select word(s), open emotion dropdown with emoticons and names
2. **Inline syntax** — Type `[angry]word[/angry]` or equivalent in text mode
3. **Shortcut numbers** — Each emotion has a number (#1 = Angry, #2 = Shy, etc.) for rapid input
4. **Keyboard shortcuts** — Select word, press `Ctrl+1` for Angry, `Ctrl+2` for Shy, etc.
5. **Right-click context menu** — Select word, right-click, pick emotion from menu
6. **Recently used** — Last-used emotions appear at the top of the dropdown, like custom colors in Microsoft Paint

### Power User Flow
1. Writer learns shortcut numbers over time
2. Eventually types `#1` or presses `Ctrl+1` without thinking
3. Recently-used emotions surface the most common ones
4. Result: experienced writers can emotie-tag at nearly typing speed

---

## 4. Custom Emotions

We have 17 built-in emotions. Should users be able to create their own?

### Option A: Built-In Only
Only the 17 predefined emotions are available. Every Speed Book uses the same palette.

- **Pro:** Consistency across all Speed Books. Readers know what to expect. Simpler implementation. Easier to optimize rendering.
- **Con:** Constraining for advanced authors. May not cover all creative needs.

### Option B: Fully Custom Emotions
Authors can define new emotions with custom font styling, size, pacing, and effects.

- **Pro:** Maximum creative freedom. Authors can craft unique reading experiences.
- **Con:** Fragmentation — each Speed Book feels different. Harder for readers to build familiarity. Complex editor UI. Risk of visual chaos.

### Decision: Emotion Preview/Editor

Since emotions = presets for raw styles, custom emotions are natural — they're just new named presets. The question is scope:

- **Per-book presets** — custom emotions defined in a specific Speed Book, only available there
- **Per-author presets** — saved to the author's account/profile, available across all their books
- **Both** — author has a personal library of presets, and can also define book-specific ones

An **emotion preview/editor** would let authors:
1. Pick a base emotion (or start from scratch)
2. Tweak raw style properties (weight, size, duration, effect, etc.)
3. See a live preview of how the word looks/behaves
4. Save it as a named custom emotion with an emoticon

This also means the 17 built-in emotions are just the default preset library — they use the exact same system as custom emotions, they're just pre-defined.

---

## 5. Token Grouping

Applying one emotion to a phrase rather than word-by-word.

### Decision: Grouping Is a UI Helper, Not a Data Model Concept

In the data model, every token has its own emotion individually. There is no "group" entity stored in the document.

Grouping is a **UI convenience** in the editor:
- Select multiple words (like selecting multiple files on a desktop)
- Apply an emotion — each selected token gets that emotion set individually
- This is a batch-apply action, not a persistent grouping

**Why no persistent groups:**
- Simpler data model — each token is self-contained
- No ambiguity about inheritance or nesting
- Easier to reason about what a token will look like (just check its own properties)
- The author can always select and re-apply to change a range

**Future consideration:** If persistent groups become valuable (e.g., for the hybrid text format), they can be added later as syntactic sugar that compiles down to individual token emotions.

---

## 6. Document Structure

### Proposed Hierarchy

```
SpeedBook
├── metadata (title, author, description, version)
├── sections[]
│   ├── title (optional)
│   ├── defaultEmotion (optional — inherited by all tokens unless overridden)
│   └── paragraphs[]
│       └── tokens[]
│           ├── value
│           ├── emotion (or inherited from section)
│           ├── duration
│           ├── pause
│           └── ...
└── emotionPresets[] (custom emotion definitions)
```

### Sections
- Named divisions of the book (like chapters, but can be shorter)
- Optional title displayed to the reader (as a pause/interstitial?)
- Optional default emotion — sets the mood for the entire section unless tokens override
- **Scene breaks** — empty sections or special separator tokens between scenes

### Paragraphs
- Groups of tokens separated by line breaks
- May have natural pacing implications (slight pause between paragraphs)

### Metadata
- Title, author name, description
- Version (format version for compatibility)
- Estimated reading time (calculated from token count + durations)
- Tags/categories (for the library/publishing layer)
- Thumbnail/cover (for the library)

---

## 7. Timing Model

### Proposed: Relative Timing with Automatic Punctuation

**Base timing:** Derived from reader's WPM setting. `60000 / WPM` = milliseconds per word.

**Per-token modifiers (author-controlled):**
- `duration` — multiplier on base timing (e.g., `2x` = displayed twice as long). Default: `1x`.
- `pause` — additional pause *after* this token in ms. Default: `0`.

**Automatic punctuation pauses (system-controlled, reader-adjustable):**
- Period/exclamation/question mark → natural pause (e.g., 1.5x duration)
- Comma → slight pause (e.g., 1.2x duration)
- Ellipsis → extended pause (e.g., 2x duration)
- Em-dash → slight pause (e.g., 1.1x duration)
- These are defaults that the reader can adjust or disable

**Why relative over absolute:**
- Respects the reader's chosen WPM — a "slow" word at 200 WPM is proportionally slow at 400 WPM too
- Authors design the rhythm, readers control the speed
- Absolute timing (e.g., 500ms) would feel wrong at high WPM or low WPM

**Emotion-implied timing:**
- Each emotion in the built-in set has a default duration modifier (e.g., Shy = 1.3x slower, Excited = 0.8x faster)
- Authors can override per-token if needed
- The emotion table from the vision doc defines these defaults

---

## 8. Emotion Layering

### Proposed: Explicit Override, No Auto-Merge

When a token is inside a section or group with a default emotion, and also has its own emotion:

- **The token's emotion wins completely** — no blending or merging
- If the author wants a combined emotion, they explicitly use a combination preset (see Custom Emotions above)
- This keeps behavior predictable and easy to reason about

### Inheritance Chain
```
Section default emotion → Group emotion → Token emotion
                          (each level fully overrides the previous)
```

A token with no emotion inherits from its group. A group with no emotion inherits from its section. A section with no emotion uses neutral display.

---

## 9. Storage / Serialization Format

### Decision: JSON for Now

The storage format is JSON. No text-based source format for now — the GUI editor reads and writes JSON directly.

```json
{
  "version": 1,
  "metadata": {
    "title": "The Forest",
    "author": "Jane Doe"
  },
  "emotionPresets": [
    {
      "id": "dramatic-whisper",
      "name": "Dramatic Whisper",
      "icon": "🤫",
      "style": {
        "fontWeight": 300,
        "fontStyle": "italic",
        "fontSize": 0.8,
        "duration": 2.0,
        "pause": 500
      }
    }
  ],
  "sections": [
    {
      "title": "Chapter 1",
      "paragraphs": [
        {
          "tokens": [
            { "value": "The", "emotion": "calm" },
            { "value": "forest", "emotion": "calm" },
            { "value": "was", "emotion": "calm" },
            { "value": "silent.", "emotion": "calm" }
          ]
        }
      ]
    }
  ]
}
```

**Future considerations:**
- A binary format could be explored later for performance/size (especially for large books or a library with many books)
- A human-readable text format could be designed when the hybrid editor is built
- The JSON schema should be versioned from the start to allow format evolution

---

## 10. Import / Export

### Import
- **Plain text** — paste/import text, then add emotions in the editor (current flow, remains the entry point)
- **Source format** — open a `.speedbook` or `.sb` file in the editor
- **Subtitle files (.srt, .vtt)** — import video transcriptions (the original use case)

### Export
- **Compiled JSON** — for the reader engine
- **Plain text** — stripped of all emotions (just the words)
- **Source format** — for editing elsewhere or sharing with other authors
- **Video** — rendered animation of the Speed Book (future, Phase 4)
- **Embed code** — HTML snippet to embed a reader on any webpage (future)

---

## Key Takeaways

1. **One token = one word** — the atomic unit for RSVP display
2. **Raw styles are the primitives, emotions are presets** — fundamental architecture decision
3. **Background changes are a raw style property** — extends beyond just font styling (details TBD)
4. **GUI-only editor to start** — no markup syntax for now, hybrid is the long-term goal
5. **Emotion preview/editor** — for creating and tweaking custom presets (per-book or per-author)
6. **Grouping is a UI convenience** — not a data model concept; each token holds its own emotion
7. **Hierarchical document** — SpeedBook > Sections > Paragraphs > Tokens
8. **Relative timing** — based on WPM, with punctuation pauses by default, author can set delay multipliers (2x, 3x, etc.)
9. **Emotion inheritance** — section default → token override (explicit, no auto-merge)
10. **JSON storage** — simple and sufficient for now, binary/text formats are future considerations

## Resolved Decisions

| Topic | Decision |
|-------|----------|
| Token unit | One token = one word |
| Style architecture | Raw styles are primitives; emotions are named presets |
| Authoring format | GUI-only for now, hybrid later |
| Custom emotions | Yes, via emotion preview/editor (per-book or per-author TBD) |
| Token grouping | UI helper only, each token stores its own emotion |
| Timing model | Relative to WPM, with punctuation pauses and author delay multipliers |
| Emotion layering | Explicit override, no auto-merge |
| Storage format | JSON for now |

## Additional Discussion: Follow-Up Questions

### Punctuation & Language Support

**Decided.** Keep punctuation as part of the token value. Split by whitespace, done. CJK and other complex segmentation is a future problem.

- Auto-punctuation pauses detect trailing `.`, `,`, `!`, `?`, `...` via simple regex — works for latin scripts
- Non-latin languages (CJK, Arabic, etc.) rely on author-set manual pauses
- Tokenization splits on whitespace — CJK word segmentation is a future problem
- Document-level locale metadata could tune auto-pause behavior per language

### Emotion Transitions

**Decided.** Per-emotion exit/entrance. Each emotion preset defines:
- `entrance` — how the word appears when this emotion starts (fade-in, pop, expand, etc.)
- `exit` — how the word leaves when the next emotion is different (fade-out, shrink, snap, etc.)

Transition between emotions = outgoing emotion's exit + incoming emotion's entrance. No combinatorial N*N map needed.

Authors can override per-token if they want a specific transition. Background changes (brightness, patterns) interpolate smoothly over the transition duration.

### Ghost Word Styling

**Decided.** Ghost words are always neutral/plain styling, just faded. Emotion styling only kicks in when the word becomes the current (center) word. This preserves the emotional impact of each reveal.

Previous ghost words (already read) retain a **faint hint** of their emotion styling — since the reader already experienced them. Upcoming ghost words are always fully neutral to avoid spoiling.

### Opacity as Raw Style

**Decision:** Added to raw style properties. Useful for whisper/shy effects — fading text is more expressive than just smaller text.

```
TokenStyle {
  ...existing properties...
  opacity — 0.0 to 1.0 (default: 1.0)
}
```

### Section Default Emotions — Why They're Different From Bulk-Apply

A section default emotion is a **creative intent**, not just a batch operation:

- **Bulk-apply** = "make these specific tokens calm" — one-time past action
- **Section default** = "this section *is* calm" — ongoing, new tokens added to the section automatically inherit the default emotion

In the data model, the section stores a `defaultEmotion`. Each token still stores its own emotion individually. When a token has no explicit emotion, it inherits from the section default. When new tokens are added (author writes more text in that section), they automatically get the section's emotion.

This is the one case where "grouping" is persistent in the data — but it's at the section level, not arbitrary span-level.

**Note:** Section default emotions are a future implementation. Not needed for the initial version — authors can bulk-apply in the UI for now.

## Open Questions

- **Custom emotion scope:** Per-book, per-author, or both?
- **File extension** for Speed Books (`.speedbook`? `.sb`? `.spb`?)
- **Section transitions:** How do section breaks appear to the reader? (Pause? Title card? Fade?)
- **Traditional reading fallback:** Should the reader support a non-RSVP mode (full text with emotion styling)?
- **Document naming:** What do we call the format/file? "Speed Book"? Something else?
- **Previous ghost word emotion hints:** Should already-read ghost words show faint emotion styling, or stay fully neutral?

## Action Items

- [ ] Define the full set of raw style properties (finalize what's in `TokenStyle`)
- [ ] Define the 17 built-in emotion presets (map each to raw style values)
- [ ] Design the JSON schema for a Speed Book document
- [ ] Design the emotion preview/editor UI concept
- [ ] Decide on background change behavior
