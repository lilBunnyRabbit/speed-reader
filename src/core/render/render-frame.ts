/**
 * Framework-agnostic Canvas 2D renderer for the exported video.
 *
 * The visual is pure text on a luminance-only background, so every frame is drawn
 * directly to a canvas — no DOM screenshotting. Pure functions over a 2D context;
 * no React, no `document`. Survives the SvelteKit rewrite verbatim and is reusable
 * for thumbnails later.
 *
 * Coordinate space is the export resolution (default 1080x1920, vertical 9:16).
 */

export type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export interface FrameStyle {
  /** Output width in px. */
  width: number;
  /** Output height in px. */
  height: number;
  /** Solid background fill (near-black; luminance only). */
  background: string;
  /** CSS font-family stack. Must be loaded (see {@link fontShorthand}) before rendering. */
  fontFamily: string;
  /** Numeric font weight for the current word. */
  fontWeight: number;
  /** Current-word fill (near-white). */
  wordColor: string;
  /** Upper bound for the auto-fit word size. */
  maxWordSize: number;
  /** Lower comfort bound for the auto-fit word size (a longer word may still shrink below this to fit). */
  minWordSize: number;
  /** Fill for the persistent attribution line. */
  attributionColor: string;
  /** Attribution font size. */
  attributionSize: number;
  /** Optional channel handle drawn at the top, or null. */
  watermark: string | null;
  /** Watermark fill. */
  watermarkColor: string;
  /** Watermark font size. */
  watermarkSize: number;
  /** Whether to draw faded previous/next ghost words flanking the current word. */
  showGhosts: boolean;
  /** Ghost word fill. */
  ghostColor: string;
  /** Reserved zone at the top (YouTube chrome / title). */
  safeTop: number;
  /** Reserved zone at the bottom (like/comment/share + caption). */
  safeBottom: number;
  /** Reserved zone on each side. */
  safeSide: number;
  /** Upper bound for the end-card paragraph size. */
  endCardMaxSize: number;
  /** Lower bound for the end-card paragraph size. */
  endCardMinSize: number;
}

export const DEFAULT_FRAME_STYLE: FrameStyle = {
  width: 1080,
  height: 1920,
  background: "#0d0d10",
  fontFamily: '"Roboto Mono", ui-monospace, monospace',
  fontWeight: 700,
  wordColor: "#f5f5f4",
  maxWordSize: 156,
  minWordSize: 96,
  attributionColor: "rgba(245, 245, 244, 0.6)",
  attributionSize: 44,
  watermark: null,
  watermarkColor: "rgba(245, 245, 244, 0.32)",
  watermarkSize: 36,
  showGhosts: false,
  ghostColor: "rgba(245, 245, 244, 0.18)",
  safeTop: 180,
  safeBottom: 390,
  safeSide: 60,
  endCardMaxSize: 84,
  endCardMinSize: 40,
};

/** Build a CSS font shorthand for a given size — use to load the font before rendering. */
export function fontShorthand(style: FrameStyle, sizePx: number): string {
  return `${style.fontWeight} ${Math.round(sizePx)}px ${style.fontFamily}`;
}

/** The resolution the default px sizes/safe-zones are authored for. */
const REFERENCE_WIDTH = 1080;
const REFERENCE_HEIGHT = 1920;

/**
 * Scale all px-based sizes and safe zones to the style's actual resolution, so a
 * custom width/height (e.g. 720×1280 or 1080×1080) stays proportioned. Font sizes use
 * the smaller axis ratio; vertical zones scale with height, horizontal with width.
 */
export function scaleStyle(style: FrameStyle): FrameStyle {
  const sx = style.width / REFERENCE_WIDTH;
  const sy = style.height / REFERENCE_HEIGHT;
  const s = Math.min(sx, sy);
  return {
    ...style,
    maxWordSize: style.maxWordSize * s,
    minWordSize: style.minWordSize * s,
    attributionSize: style.attributionSize * s,
    watermarkSize: style.watermarkSize * s,
    safeTop: style.safeTop * sy,
    safeBottom: style.safeBottom * sy,
    safeSide: style.safeSide * sx,
    endCardMaxSize: style.endCardMaxSize * s,
    endCardMinSize: style.endCardMinSize * s,
  };
}

/** Vertical center of the content-safe band. */
function bandCenterY(style: FrameStyle): number {
  return style.safeTop + (style.height - style.safeTop - style.safeBottom) / 2;
}

function maxTextWidth(style: FrameStyle): number {
  return style.width - 2 * style.safeSide;
}

/** Largest size (<= max) at which `word` fits the safe width; never below a hard floor so it always fits. */
function fitWordSize(ctx: Ctx2D, word: string, style: FrameStyle): number {
  if (!word) return style.maxWordSize;
  ctx.font = fontShorthand(style, style.maxWordSize);
  const w = ctx.measureText(word).width;
  if (w <= maxTextWidth(style)) return style.maxWordSize;
  const scaled = (style.maxWordSize * maxTextWidth(style)) / w;
  return Math.max(40, Math.floor(scaled));
}

function wrapWords(ctx: Ctx2D, words: string[], maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export interface PreparedQuote {
  words: string[];
  attribution?: string;
  style: FrameStyle;
  /** One constant word size for the whole quote (no jitter between words). */
  wordFontSize: number;
  endCard: { lines: string[]; fontSize: number; lineHeight: number };
}

/**
 * Pre-measure the quote: pick a single word size that fits the longest word, and
 * wrap + size the full-quote end card. Runs once per quote (not per frame).
 */
export function prepareQuote(
  ctx: Ctx2D,
  words: string[],
  attribution: string | undefined,
  style: FrameStyle
): PreparedQuote {
  const display = words.filter((w) => w.trim().length > 0);

  // Constant word size = smallest per-word fit, so the widest word still fits.
  let wordFontSize = style.maxWordSize;
  for (const word of display) {
    wordFontSize = Math.min(wordFontSize, fitWordSize(ctx, word, style));
  }

  // End card: wrap the full quote and shrink until it fits the safe band height.
  const band = style.height - style.safeTop - style.safeBottom;
  let fontSize = style.endCardMaxSize;
  let lines: string[] = display;
  for (; fontSize >= style.endCardMinSize; fontSize -= 2) {
    ctx.font = fontShorthand(style, fontSize);
    lines = wrapWords(ctx, display, maxTextWidth(style));
    const lineHeight = fontSize * 1.32;
    const totalHeight = lines.length * lineHeight + style.attributionSize * 2;
    const widest = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
    if (totalHeight <= band * 0.82 && widest <= maxTextWidth(style)) break;
  }

  return {
    words,
    attribution,
    style,
    wordFontSize,
    endCard: { lines, fontSize, lineHeight: fontSize * 1.32 },
  };
}

function paintBackdrop(ctx: Ctx2D, p: PreparedQuote): void {
  const { style } = p;
  ctx.fillStyle = style.background;
  ctx.fillRect(0, 0, style.width, style.height);

  ctx.textAlign = "center";

  if (style.watermark) {
    ctx.font = fontShorthand({ ...style, fontWeight: 500 }, style.watermarkSize);
    ctx.fillStyle = style.watermarkColor;
    ctx.textBaseline = "middle";
    ctx.fillText(style.watermark, style.width / 2, style.safeTop + style.watermarkSize);
  }
}

function paintAttribution(ctx: Ctx2D, p: PreparedQuote): void {
  if (!p.attribution) return;
  const { style } = p;
  const y = style.height - style.safeBottom - style.attributionSize * 2.2;
  ctx.font = fontShorthand({ ...style, fontWeight: 500 }, style.attributionSize);
  ctx.fillStyle = style.attributionColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(p.attribution, style.width / 2, y);
}

/** Draw the frame for the word at `index` (current word + optional ghosts + attribution). */
export function renderWord(ctx: Ctx2D, p: PreparedQuote, index: number): void {
  const { style, words, wordFontSize } = p;
  paintBackdrop(ctx, p);

  const centerX = style.width / 2;
  const centerY = bandCenterY(style);

  if (style.showGhosts) {
    ctx.font = fontShorthand(style, wordFontSize * 0.5);
    ctx.fillStyle = style.ghostColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const prev = words[index - 1];
    const next = words[index + 1];
    if (prev) ctx.fillText(prev, centerX, centerY - wordFontSize);
    if (next) ctx.fillText(next, centerX, centerY + wordFontSize);
  }

  const word = words[index] ?? "";
  if (word) {
    ctx.font = fontShorthand(style, wordFontSize);
    ctx.fillStyle = style.wordColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(word, centerX, centerY);
  }

  paintAttribution(ctx, p);
}

/** Draw the end-card frame: the full quote wrapped + centered, with attribution. */
export function renderEndCard(ctx: Ctx2D, p: PreparedQuote): void {
  const { style, endCard } = p;
  paintBackdrop(ctx, p);

  ctx.font = fontShorthand(style, endCard.fontSize);
  ctx.fillStyle = style.wordColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerX = style.width / 2;
  const blockHeight = endCard.lines.length * endCard.lineHeight;
  let y = bandCenterY(style) - blockHeight / 2 + endCard.lineHeight / 2;
  for (const line of endCard.lines) {
    ctx.fillText(line, centerX, y);
    y += endCard.lineHeight;
  }

  paintAttribution(ctx, p);
}
