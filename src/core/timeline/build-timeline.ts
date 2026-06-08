import { Token } from "@/models/token";
import { EMPTY_TIMELINE, PauseSettings, Timeline, TimelineSegment } from "./timeline.types";

/**
 * Build the playback/export schedule.
 *
 * `holdMs = baseMs + (stop ? stopMs : 0) + endHold(last token only)`, where
 * `baseMs = 60000 / wpm`. Pauses are MANUAL: a token is held longer only when it's
 * flagged `stop` in the editor — the word that ends a thought simply stays on screen
 * longer (no blank beat). The end-hold is always added to the final token so a looped
 * video doesn't snap-repeat.
 */
export function buildTimeline(tokens: Token[], wpm: number, settings: PauseSettings): Timeline {
  if (tokens.length === 0) return EMPTY_TIMELINE;

  const safeWpm = wpm > 0 ? wpm : 1;
  const baseMs = 60000 / safeWpm;
  const lastIndex = tokens.length - 1;

  const segments: TimelineSegment[] = new Array(tokens.length);
  let startMs = 0;

  for (let i = 0; i < tokens.length; i++) {
    let pauseMs = tokens[i].stop ? Math.max(0, settings.stopMs) : 0;
    if (i === lastIndex) {
      pauseMs += Math.max(0, settings.endHoldMs);
    }

    const holdMs = baseMs + pauseMs;
    segments[i] = { tokenIndex: i, startMs, holdMs, baseMs, pauseMs };
    startMs += holdMs;
  }

  return { segments, count: segments.length, totalMs: startMs, wpm: safeWpm };
}
