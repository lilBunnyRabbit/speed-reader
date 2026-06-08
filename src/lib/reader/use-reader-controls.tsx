import {
  buildTimeline,
  DEFAULT_PAUSE_SETTINGS,
  elapsedForIndex,
  indexForElapsed,
  PauseSettings,
  Timeline,
} from "@/core/timeline";
import { useBindState } from "@/hooks/use-bind-state";
import { SpeedDocument } from "@/models/speed-document";
import React from "react";

export function useReaderSettings() {
  const wpm = useBindState<number>(300);
  const ghostWords = useBindState<number>(3);
  const stopMs = useBindState<number>(DEFAULT_PAUSE_SETTINGS.stopMs);
  const endHoldMs = useBindState<number>(DEFAULT_PAUSE_SETTINGS.endHoldMs);

  return { wpm, ghostWords, stopMs, endHoldMs };
}

export type ReaderSettings = ReturnType<typeof useReaderSettings>;

/**
 * requestAnimationFrame-driven playback over a pre-computed {@link Timeline}.
 *
 * The timeline is the single source of truth (shared with the exporter), so pauses
 * and the 2s end-hold are just longer holds in the schedule — not timer hacks.
 * rAF with a wall-clock accumulator is self-correcting (no setInterval drift).
 */
export function useReaderControls(document: SpeedDocument, settings: ReaderSettings) {
  const [status, setStatus] = React.useState<"paused" | "playing">("paused");
  const [index, setIndexState] = React.useState(0);

  const pauseSettings = React.useMemo<PauseSettings>(
    () => ({
      stopMs: settings.stopMs.value ?? DEFAULT_PAUSE_SETTINGS.stopMs,
      endHoldMs: settings.endHoldMs.value ?? DEFAULT_PAUSE_SETTINGS.endHoldMs,
    }),
    [settings.stopMs.value, settings.endHoldMs.value]
  );

  const timeline = React.useMemo(
    () => buildTimeline(document.tokens, settings.wpm.value ?? 0, pauseSettings),
    [document.tokens, settings.wpm.value, pauseSettings]
  );

  const timelineRef = React.useRef<Timeline>(timeline);
  const indexRef = React.useRef(0);
  const elapsedRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef<number | null>(null);

  const stop = React.useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTsRef.current = null;
    setStatus("paused");
  }, []);

  const tick = React.useCallback(
    (ts: number) => {
      const tl = timelineRef.current;

      if (lastTsRef.current == null) lastTsRef.current = ts;
      const delta = ts - lastTsRef.current;
      lastTsRef.current = ts;
      elapsedRef.current += delta;

      if (elapsedRef.current >= tl.totalMs) {
        elapsedRef.current = tl.totalMs;
        indexRef.current = Math.max(0, tl.count - 1);
        setIndexState(indexRef.current);
        stop();
        return;
      }

      const next = indexForElapsed(tl, elapsedRef.current);
      if (next !== indexRef.current) {
        indexRef.current = next;
        setIndexState(next);
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [stop]
  );

  const start = React.useCallback(() => {
    const tl = timelineRef.current;
    if (tl.count === 0) return;

    // Replay from the start if parked on the final word.
    if (indexRef.current >= tl.count - 1) {
      indexRef.current = 0;
      elapsedRef.current = 0;
      setIndexState(0);
    }

    lastTsRef.current = null;
    setStatus("playing");
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const toggle = React.useCallback(() => {
    if (rafRef.current != null) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  /** Seek to a token (slider drag, step/skip buttons). */
  const setIndex = React.useCallback((next: number) => {
    const tl = timelineRef.current;
    const clamped = Math.max(0, Math.min(Math.max(0, tl.count - 1), next));
    indexRef.current = clamped;
    elapsedRef.current = elapsedForIndex(tl, clamped);
    setIndexState(clamped);
  }, []);

  // Keep the live timeline current; re-anchor elapsed to the current word's start so a
  // mid-play WPM/pause change doesn't jump the reader to a different word.
  React.useEffect(() => {
    timelineRef.current = timeline;
    const clamped = Math.max(0, Math.min(Math.max(0, timeline.count - 1), indexRef.current));
    if (clamped !== indexRef.current) {
      indexRef.current = clamped;
      setIndexState(clamped);
    }
    elapsedRef.current = elapsedForIndex(timeline, clamped);
  }, [timeline]);

  // Cancel any in-flight frame on unmount.
  React.useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    index,
    setIndex,
    start,
    stop,
    toggle,
    status,
    timeline,
    totalMs: timeline.totalMs,
  } as const;
}
