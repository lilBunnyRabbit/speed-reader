/**
 * Framework-agnostic timing model for the speed reader.
 *
 * A {@link Timeline} is a pre-computed schedule: for each token, when it appears
 * and how long it stays on screen (including pauses). It is the SINGLE SOURCE OF
 * TRUTH consumed by both the live reader (requestAnimationFrame playback) and the
 * video exporter (fixed-step frame emission) — so the preview matches the export
 * exactly.
 *
 * Pure TS, no framework imports — survives the eventual SvelteKit rewrite verbatim.
 */

/**
 * Reader/export-adjustable pause magnitudes.
 *
 * Base per-word time stays WPM-relative (`60000 / wpm`). Pauses are ADDITIVE and
 * expressed in ABSOLUTE milliseconds — a dramatic beat is human-constant, not
 * speed-relative, and a loop-safety tail is meaningless as a multiplier.
 *
 * Pauses are MANUAL: a token is held longer only when it's flagged as a "stop"
 * token in the editor. There are no automatic punctuation pauses.
 */
export interface PauseSettings {
  /** Pause (ms) held after a token flagged `stop` in the editor. */
  stopMs: number;
  /**
   * Hold (ms) on the FINAL word so a looped video doesn't snap-repeat ("OOF").
   * Independent of stop tokens — always applied.
   */
  endHoldMs: number;
}

export const DEFAULT_PAUSE_SETTINGS: PauseSettings = {
  stopMs: 700,
  endHoldMs: 2000,
};

/**
 * Minimum end-hold the EXPORTER enforces regardless of the user's live-reader
 * preference, so a Short can never ship with a snap-repeating loop.
 */
export const MIN_EXPORT_END_HOLD_MS = 1500;

export interface TimelineSegment {
  /** Index into the source `tokens` array. Always equals the segment's own position. */
  tokenIndex: number;
  /** Cumulative start time (ms) from t=0. */
  startMs: number;
  /** Total time (ms) this token stays on screen, including any pause/end-hold. */
  holdMs: number;
  /** Base WPM-derived display time (ms), before pauses. */
  baseMs: number;
  /** Additive pause (ms) folded into {@link holdMs} (punctuation pause + end-hold). */
  pauseMs: number;
}

export interface Timeline {
  /** One segment per token, contiguous: `segments[i+1].startMs === segments[i].startMs + segments[i].holdMs`. */
  segments: TimelineSegment[];
  /** Number of segments (=== token count). */
  count: number;
  /** Total duration (ms), including the end-hold. */
  totalMs: number;
  /** The WPM the timeline was built with (after the >0 guard). */
  wpm: number;
}

export const EMPTY_TIMELINE: Timeline = { segments: [], count: 0, totalMs: 0, wpm: 1 };
