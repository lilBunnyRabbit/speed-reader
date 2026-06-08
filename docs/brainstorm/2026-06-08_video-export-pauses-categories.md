# Video Export + Sentence Pauses + 2s End-Hold + Categories — Synthesis

**Date:** 2026-06-08
**Participants:** lilbunnyrabbit + Claude

## Context

The user runs a passive YouTube Shorts quote channel using the existing React RSVP speed-reader. Today they screen-record the live reader and hand-edit pauses, which is slow and imprecise. They want four things:

1. Direct **video export** (vertical 1080×1920, Shorts-ready) to stop screen-recording.
2. Automatic **pauses between sentences** for multi-sentence quotes.
3. A mandatory **~2s end-hold** so looped Shorts don't snap-repeat ("OOF").
4. **Categories** to mass-produce.

This session synthesizes four parallel design streams (video-export tech, pause-timing engine, format-and-categories, build-where strategy) into one actionable plan, applying the adversarial-review corrections. Related prior docs: `2026-02-14_token-system-design.md` (§7 timing model), `2026-02-14_reader-engine.md` (§3 rAF time-accumulator), `ROADMAP.md` (Phase 1 = replicate reader in SvelteKit; Phase 4 = video export for social).

## Topics discussed (with decisions)

### Where to build — DECIDED: React now, pure-TS core under `src/core/`
- Build in the existing React app; extract timeline builder, canvas renderer, video encoder, and quote-library schema into framework-agnostic pure-TS modules (`src/core/`, no React/JSX, ESLint-enforced). React stays ~4 glue files.
- Every hard part is inherently non-React (ms math, Canvas 2D, WebCodecs, JSON), so it ports to SvelteKit verbatim — the throwaway risk that normally sinks building-in-React doesn't apply.
- Rejected bootstrapping SvelteKit now: Phase 1 is "replicate the existing reader in SvelteKit," which doesn't exist yet; export gains nothing from SvelteKit and would block the feature behind a full reader re-derivation.
- Correction applied: the "freezing a live revenue pipeline" urgency some streams leaned on is NOT supported by the repo — video export is a *future* revenue path (pitch / Phase 4), not a running pipeline. The portability case stands on its own.

### Video export tech — DECIDED: WebCodecs `VideoEncoder` (H.264 `'avc'`) → MP4 via Mediabunny
- `Output` + `Mp4OutputFormat` + `BufferTarget` + `CanvasSource`, fixed 30fps, `await source.add(ts, 1/fps)` per frame.
- Use **`mediabunny`**, NOT `mp4-muxer`/`webm-muxer` (deprecated, folded into Mediabunny). `BufferTarget` replaces `ArrayBufferTarget`; read `output.target.buffer`.
- Pass `OffscreenCanvas` directly (no cast). Leave `hardwareAcceleration` default `'no-preference'` (Chrome treats `'prefer-hardware'` as a hard requirement). One-line VP9/WebM fallback if `avc` unsupported.
- Rejected MediaRecorder (real-time, drops frames — relocates the jitter problem) and ffmpeg.wasm (~25–30 MB).
- Critical bugs applied from review: **must `await source.add()`** (fire-and-forget OOM-crashes the encoder queue); **must load the export webfont** (`document.fonts.ready` main-thread, or `FontFace.load()` + `self.fonts.add()` in a worker — current reader uses CSS `font-mono` system stack); keyframe at frame 0 for a clean loop seam; 10–12 Mbps; near-black bg ~0.06 / text ~0.96 to avoid 8-bit banding.
- Ship video-only (silent Shorts are accepted and monetizable). Silent AAC track only if a downstream tool rejects audio-less files.

### Pause/timeline model — DECIDED: one pure `Timeline`, pauses as absolute ms baked into `holdMs`
- `buildTimeline(tokens, wpm, pauseSettings)` produces `{ segments:[{tokenIndex,startMs,holdMs,baseMs,pauseMs}], count, totalMs, wpm }`, one segment per token, no gaps. A pause is extra `holdMs` on the preceding word (hold the last word of the sentence; no blank beat).
- Base word time stays WPM-relative (`60000/wpm`); sentence pauses + end-hold are absolute ms (a dramatic beat is human-constant; a 2s tail is meaningless as a multiplier). Authored per-token `duration` stays a relative multiplier.
- Avoid double-count: replace §7's punctuation *multiplier* with additive absolute pauses; don't apply both to the same boundary.
- Defaults: sentence 700, comma 250, ellipsis 900, dash 150, endHold 2000, autoPauses true.
- Detection on `token.v`: ellipsis tested before sentence; allow trailing closers incl. curly quotes `” ’`; **abbreviation guard** (Mr./Dr./U.S./e.g./initials) to avoid spurious sentence pauses in a passive pipeline; sentence pauses only when >1 sentence.
- End-hold: separate code path from `autoPauses`; baked into the final segment; exporter clamps a ~1500ms floor.
- ms→frames with a carried fractional-frame remainder (baseMs is non-integer for most WPM) and an integer-pinned tail.
- Live reader: replace `setInterval` with a rAF time-accumulator + binary-search seek; export uses a synthetic fixed-step clock (never rAF — background-tab throttling). Mid-play timeline rebuild re-anchors proportionally through the current segment.

### On-screen format — DECIDED: 1080×1920, dark/near-white, luminance-only
- Corrected safe zones (YouTube 900×1350): top ~180px, bottom ~390px (~20%, NOT 12%), sides ~60px. Current word centered in the safe band (~y 880); persistent `— Author` line; watermark at TOP (bottom is YT chrome); ghost words OFF by default (toggle).
- Loop seam: frame 0 = fully-visible first word (no fade-from-black); end card = full quote (screenshot-able, clean cut back to word 1). Reconcile `openHoldMs` with the 2s card.
- Auto-fit one constant font size per quote; deterministic fallback + review flag for pathological long tokens. Multi-line end-card wrap is the one non-trivial canvas layout to spec.

### Categories / library — DECIDED: localStorage text+metadata, JSON import/export
- `SpeedDocument`/`Token` have NO author/source/category today — add attribution + category as real fields (don't reuse `title`).
- Store plain text + metadata (NOT tokens; derive via existing `SpeedDocumentBuilder.build`). JSON export/import is the real backup + rewrite-survival layer. Resolution order quote → category → global. Keep localStorage text-only (UTF-16 ~5MB cap).
- Compile to the FLAT `SpeedDocument` (nested sections/paragraphs SpeedBook is future design — don't target now).
- Batch (the passive win): bulk paste (`quote — author` split on last ` — ` with review confirm), review grid (the one human glance + auto-flags incl. abbreviation pauses), sequential export queue, deterministic filenames, `status ready→rendered`. Run encode in OffscreenCanvas + Web Worker; `.close()` VideoFrames.

## Key takeaways
- All four asks are doable and compose cleanly around one pure `Timeline` shared by live reader + exporter (preview == export).
- The 2s end-hold and sentence pauses become *data* (`holdMs`), not timer races — the whole point of pre-computing.
- The expensive code is non-React, so building in React now costs nothing at the SvelteKit rewrite.
- The schema genuinely lacks attribution/category — that's the one real data-model change this work forces.

## Action items
- [ ] Build `src/core/timeline/` and rewire `use-reader-controls.tsx` (ships pauses + end-hold in live preview).
- [ ] Add ESLint `no-restricted-imports` ban on react/react-dom under `src/core/**`.
- [ ] Build `src/core/render/render-frame.ts` (consume `token.e` emotions) + `src/core/export/encode-video.ts` (Mediabunny, `await add()`, font preload).
- [ ] Add a loaded mono/heavy webfont; `await document.fonts.ready` before first frame.
- [ ] Build `src/core/library/` + JSON import/export + add attribution/category to the data model.
- [ ] Delete dead `src/lib/reader/word-renderer.ts`.
- [ ] Fix the `secondsToTime(...)` object-vs-string duration label in `reader.tsx`.
- [ ] Move encode to OffscreenCanvas + Web Worker before scaling batch.

## Open questions
- Exact end-hold magnitude (1500 / 2000 / 2500ms) — feel call.
- Font identity: keep `font-mono` brand or switch to heavy sans (Inter/Manrope 700–800) for mobile legibility.
- Default WPM for quotes (~240 proposed, slower than the app's 300).
- End-card default style (full-quote recommended) and watermark/handle text.
- Ghost words: keep/drop for quotes (drop recommended).
- Whether to persist pause settings (nothing persists today).
- MP4/H.264 vs WebM/VP9 default container/codec.

## Next session topics
- Spec the `RenderOpts`/`LayoutOptions` emotion→canvas-weight mapping concretely.
- Design the review-grid flag rules and bulk-import attribution parser.
- Worker boundary + VideoFrame lifecycle for batch encode.

## Implementation Progress (2026-06-08)

**Step 1 — pauses + 2s end-hold (DONE, verified).** New framework-agnostic core under `src/core/timeline/` (`timeline.types`, `punctuation`, `build-timeline`, `navigation`). `use-reader-controls.tsx` rewired from `setInterval` to a rAF time-accumulator that walks the pre-computed `Timeline`; reader settings gained an auto-pause toggle + sentence-pause + end-hold inputs; duration label now reflects `timeline.totalMs`. Dead `word-renderer.ts` deleted. 24 logic assertions pass (sentence pauses fire only on multi-sentence text, end-hold survives auto-pauses off, abbreviation guard, seek).

**Step 2 — video export (DONE, verified in real Chrome).** `src/core/render/render-frame.ts` (pure Canvas 2D: bg, auto-fit word, ghosts, attribution, watermark, full-quote end card), `src/core/export/frame-plan.ts` (ms→frames with fractional carry + end-card/tail split), `src/core/export/encode-video.ts` (mediabunny WebCodecs H.264→MP4, `getFirstEncodableVideoCodec` avc→vp9 fallback, awaited `add()` backpressure, font preload). React glue `src/lib/reader/export-panel.tsx`. ESLint bans react imports under `src/core/**`. Playwright smoke test produced a valid **H.264 MP4, 1080×1920, 30fps, 6.2s** with correct pause/tail timing. Added dep: `mediabunny@1.46.0`.

**Decisions locked:** build in React with logic in `src/core/`; MP4/H.264 default; ghost words off by default (toggle); video-only (silent).

**Step 3 — categories / quote library (PENDING).** localStorage quote library (text + attribution + category), JSON import/export, bulk-paste → review-grid → batch render queue. Plus the open "feel" calls below (font identity, default WPM, end-card style).

## Revision — manual stop tokens + richer export (2026-06-08, later)

User feedback redirected the pause model and asked for more export control.

**Pauses → manual stop tokens (was: automatic punctuation pauses).** Removed automatic punctuation pauses entirely. Added `Token.stop?: boolean`; `buildTimeline` now holds a token longer only when `stop` is set (`+ stopMs`), plus the always-on end-hold. The editor's Tokens tab is now interactive: click a word → "Stop after" toggles its stop (visual `❚❚` marker + ring), with opt-in "Auto-mark sentence stops" (reuses `sentenceStopIndices`/`classifyBoundary`, excludes the last word) and "Clear stops". Stops live in editor state keyed by token index and reset when the raw text changes (raw stays the source of truth; tokens are derived). `Read` now builds the document from the annotated tokens via `SpeedDocumentBuilder.fromTokens`. Reader settings: "Stop Pause (ms)" replaces the auto-pause toggle + sentence-pause input. `PauseSettings` simplified to `{ stopMs, endHoldMs }`.

**Export options added.** The export panel now builds its OWN timeline (so export WPM is independent of the reader) and exposes: width/height, WPM, and background/text color pickers that default to the live app theme colors (read from `--color-background`/`--color-foreground`). Attribution/ghost/watermark colors derive from the text color. `scaleStyle()` proportionally scales fonts + safe zones to any resolution.

Verified in real Chrome: auto-marking a 2-sentence quote produced 1 stop; export at 720×1280 with black/white colors produced a valid H.264 MP4, 4.5s, timing exactly matching the stop + end-hold math.

**Open question:** stop magnitude is one global `stopMs`; if per-stop durations are wanted later, store `pause` (ms) per token (already anticipated in the token-system design) instead of a boolean.
