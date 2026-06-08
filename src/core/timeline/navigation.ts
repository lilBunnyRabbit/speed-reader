import { Timeline } from "./timeline.types";

/**
 * The token index visible at a given elapsed time (ms). Binary search over segment
 * start times; clamps to the first/last token outside the range.
 */
export function indexForElapsed(timeline: Timeline, elapsedMs: number): number {
  const { segments, count, totalMs } = timeline;
  if (count === 0) return 0;
  if (elapsedMs <= 0) return 0;
  if (elapsedMs >= totalMs) return count - 1;

  let lo = 0;
  let hi = count - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (segments[mid].startMs <= elapsedMs) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return lo;
}

/** Elapsed time (ms) at which a given token index begins. Used for seeking. */
export function elapsedForIndex(timeline: Timeline, index: number): number {
  if (timeline.count === 0) return 0;
  const clamped = Math.max(0, Math.min(timeline.count - 1, index));
  return timeline.segments[clamped].startMs;
}
