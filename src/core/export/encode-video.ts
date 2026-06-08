/**
 * Video exporter — the ONLY module that knows about `mediabunny`.
 *
 * Walks the same {@link Timeline} the live reader uses, at a fixed frame rate, and
 * encodes each token's on-screen hold as a run of identical frames. Frame-accurate
 * (a 2s pause is exactly 2s), so the export matches the preview — no screen-record
 * jitter. Deterministic: it encodes as fast as the CPU allows, not in real time.
 *
 * Pure TS (no React, no `document`); renders to an `OffscreenCanvas`. The caller is
 * responsible for loading the export font first (pass {@link ExportOptions.ensureFontsReady}).
 */
import { Timeline } from "@/core/timeline";
import {
  DEFAULT_FRAME_STYLE,
  FrameStyle,
  prepareQuote,
  PreparedQuote,
  renderEndCard,
  renderWord,
  scaleStyle,
} from "@/core/render/render-frame";
import { planScenes, totalFrames } from "./frame-plan";
import {
  BufferTarget,
  CanvasSource,
  getFirstEncodableVideoCodec,
  Mp4OutputFormat,
  Output,
  VideoCodec,
  WebMOutputFormat,
} from "mediabunny";

export interface ExportOptions {
  /** Frames per second. Static text gains nothing from 60; 30 is correct and half the frames. */
  fps?: number;
  /** Visual overrides merged over {@link DEFAULT_FRAME_STYLE}. */
  style?: Partial<FrameStyle>;
  /** Show a full-quote end card during the tail hold (recommended; screenshot-able + clean loop). */
  endCard?: boolean;
  /** The tail/end-hold (ms) from the reader settings — folded into the timeline's final segment. */
  endHoldMs: number;
  /** Export-only floor for the tail so a Short can never ship snap-repeating. */
  minEndHoldMs?: number;
  /** Target video bitrate (bps). */
  bitrate?: number;
  /** 0..1 progress callback. */
  onProgress?: (fraction: number) => void;
  /** Abort signal — cancels the encode. */
  signal?: AbortSignal;
  /** Awaited before rendering so the canvas font is loaded (caller touches `document.fonts`). */
  ensureFontsReady?: () => Promise<void>;
}

export interface ExportResult {
  blob: Blob;
  mimeType: string;
  extension: "mp4" | "webm";
  codec: VideoCodec;
  width: number;
  height: number;
  frames: number;
  durationMs: number;
}

function createCanvas(width: number, height: number): { canvas: OffscreenCanvas; ctx: OffscreenCanvasRenderingContext2D } {
  if (typeof OffscreenCanvas === "undefined") {
    throw new Error("Video export needs OffscreenCanvas, which this browser doesn't support.");
  }
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get a 2D canvas context for export.");
  return { canvas, ctx };
}

/**
 * Encode a quote to a video Blob. `words` and `timeline.segments` MUST be index-aligned
 * (one segment per token), since the renderer looks up neighbours for ghost words.
 */
export async function exportQuoteVideo(params: {
  words: string[];
  timeline: Timeline;
  attribution?: string;
  options: ExportOptions;
}): Promise<ExportResult> {
  const { words, timeline, attribution, options } = params;
  if (timeline.count === 0) throw new Error("Nothing to export — the document is empty.");

  const style: FrameStyle = scaleStyle({ ...DEFAULT_FRAME_STYLE, ...options.style });
  const fps = options.fps ?? 30;
  const bitrate = options.bitrate ?? 12_000_000;
  const endHoldMs = Math.max(0, options.endHoldMs);
  const exportTailMs = Math.max(endHoldMs, options.minEndHoldMs ?? 1500);
  const useEndCard = options.endCard ?? true;

  await options.ensureFontsReady?.();

  // Pick the best encodable codec, then the matching container.
  const codec = await getFirstEncodableVideoCodec(["avc", "vp9"], {
    width: style.width,
    height: style.height,
    bitrate,
  });
  if (!codec) {
    throw new Error("This browser can't encode video (WebCodecs unavailable). Try a recent Chrome.");
  }
  const isMp4 = codec === "avc";
  const mimeType = isMp4 ? "video/mp4" : "video/webm";
  const extension = isMp4 ? "mp4" : "webm";

  const { canvas, ctx } = createCanvas(style.width, style.height);
  const prepared: PreparedQuote = prepareQuote(ctx, words, attribution, style);

  const scenes = planScenes(timeline, fps, endHoldMs, exportTailMs, useEndCard);
  const total = totalFrames(scenes);

  const target = new BufferTarget();
  const output = new Output({
    format: isMp4 ? new Mp4OutputFormat() : new WebMOutputFormat(),
    target,
  });
  const source = new CanvasSource(canvas, {
    codec,
    bitrate,
    keyFrameInterval: 2,
    latencyMode: "quality",
  });
  output.addVideoTrack(source, { frameRate: fps });
  await output.start();

  const throwIfAborted = () => {
    if (options.signal?.aborted) throw new DOMException("Export aborted", "AbortError");
  };

  let frame = 0;
  try {
    for (const scene of scenes) {
      throwIfAborted();
      // Render once per scene — held frames are pixel-identical, so we only redraw on change.
      if (scene.kind === "endcard") {
        renderEndCard(ctx, prepared);
      } else {
        renderWord(ctx, prepared, scene.index);
      }

      for (let k = 0; k < scene.frames; k++) {
        throwIfAborted();
        // Await respects encoder backpressure — fire-and-forget floods the queue and OOM-crashes.
        await source.add(frame / fps, 1 / fps);
        frame++;
        options.onProgress?.(total === 0 ? 1 : frame / total);
      }
    }
  } catch (error) {
    await output.cancel();
    throw error;
  }

  await output.finalize();
  const buffer = target.buffer;
  if (!buffer) throw new Error("Export produced no data.");

  return {
    blob: new Blob([buffer], { type: mimeType }),
    mimeType,
    extension,
    codec,
    width: style.width,
    height: style.height,
    frames: total,
    durationMs: (total / fps) * 1000,
  };
}
