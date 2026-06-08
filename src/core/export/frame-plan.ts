import { Timeline } from "@/core/timeline";

/**
 * Frame planning for the exporter — pure, deterministic, and free of any encoder or
 * canvas dependency so it can be unit-tested in isolation.
 *
 * Each on-screen hold (ms) becomes a whole number of identical frames. Because most
 * per-word holds aren't an exact frame multiple (e.g. 200ms at 30fps = 6 frames, but
 * 50ms = 1.5), the fractional remainder is CARRIED to the next scene so total duration
 * doesn't drift and the loop seam stays accurate.
 */
export interface Scene {
  kind: "word" | "endcard";
  /** Token index this scene renders. */
  index: number;
  /** Number of identical frames to emit. */
  frames: number;
}

export function planScenes(
  timeline: Timeline,
  fps: number,
  endHoldMs: number,
  exportTailMs: number,
  endCard: boolean
): Scene[] {
  const scenes: Scene[] = [];
  let carry = 0;

  const framesFor = (ms: number, atLeast: number): number => {
    const exact = (ms / 1000) * fps + carry;
    let n = Math.round(exact);
    if (n < atLeast) n = atLeast;
    carry = exact - n;
    return n;
  };

  const last = timeline.count - 1;
  for (let i = 0; i < timeline.count; i++) {
    const seg = timeline.segments[i];

    if (i !== last) {
      scenes.push({ kind: "word", index: i, frames: framesFor(seg.holdMs, 1) });
      continue;
    }

    // Final segment: separate the built-in end-hold from the word's display time.
    const wordPortion = Math.max(0, seg.holdMs - endHoldMs);
    if (endCard) {
      scenes.push({ kind: "word", index: i, frames: framesFor(wordPortion, 1) });
      scenes.push({ kind: "endcard", index: i, frames: framesFor(exportTailMs, 1) });
    } else {
      scenes.push({ kind: "word", index: i, frames: framesFor(wordPortion + exportTailMs, 1) });
    }
  }

  return scenes;
}

export function totalFrames(scenes: Scene[]): number {
  return scenes.reduce((sum, s) => sum + s.frames, 0);
}
