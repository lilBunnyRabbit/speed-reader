/**
 * Punctuation classification for automatic pauses.
 *
 * Operates on a token's value (`token.v`). Punctuation stays attached to the word
 * (confirmed in `SpeedDocumentBuilder.build`, which splits only on whitespace), so
 * boundaries are detected from the word's trailing characters.
 */

export type Boundary = "sentence" | "ellipsis" | "comma" | "dash" | "none";

/** Trailing closing quotes/brackets to ignore so `said."`, `gone?'`, `(done.)` classify by their real punctuation. */
const TRAILING_CLOSERS = /[")'\]}»”’]+$/u;

/**
 * Common abbreviations that end in a period but are NOT sentence boundaries.
 * Avoids spurious sentence pauses on `Mr.`, `Dr.`, `etc.`, `e.g.` in attributed quotes.
 */
const ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "dr", "prof", "sr", "jr", "st", "vs", "etc", "e.g", "i.e",
  "fig", "no", "vol", "pp", "al", "inc", "ltd", "co", "corp", "dept", "est",
  "gen", "gov", "sen", "rep", "capt", "col", "lt", "sgt", "rev", "hon", "messrs",
  "mt", "ave", "blvd", "approx", "ph.d", "a.m", "p.m",
]);

function stripClosers(word: string): string {
  return word.replace(TRAILING_CLOSERS, "");
}

/** Single letters separated by dots: initials (`J`, `J.R.R`) and acronyms (`U.S`, `e.g`). */
const INITIALISM = /^[A-Za-z](\.[A-Za-z])*$/;

function isAbbreviation(base: string): boolean {
  if (!base) return false;
  if (ABBREVIATIONS.has(base.toLowerCase())) return true;
  return INITIALISM.test(base);
}

/**
 * Classify the pause boundary implied by a word's trailing punctuation.
 * Order matters: ellipsis is tested before a single period.
 */
export function classifyBoundary(word: string | undefined): Boundary {
  if (!word) return "none";

  const w = stripClosers(word);
  if (!w) return "none";

  // Ellipsis: 2+ trailing dots, or the ellipsis character.
  if (/(\.{2,}|…)$/u.test(w)) return "ellipsis";

  // Em/en dash or double hyphen at the very end.
  if (/(—|–|--)$/u.test(w)) return "dash";

  // Sentence enders: any run of . ! ? — but guard single periods on abbreviations.
  const enders = w.match(/([.!?]+)$/u);
  if (enders) {
    const run = enders[1];
    if (run.includes("!") || run.includes("?")) return "sentence";
    // Run is a single period (2+ handled by the ellipsis branch above).
    const base = w.slice(0, w.length - run.length);
    if (isAbbreviation(base)) return "none";
    return "sentence";
  }

  // Intra-sentence rhythm.
  if (/[,;:]$/u.test(w)) return "comma";

  return "none";
}

/** Number of sentence-ending tokens. */
export function countSentences(tokens: ReadonlyArray<{ v: string }>): number {
  let n = 0;
  for (const token of tokens) {
    if (classifyBoundary(token.v) === "sentence") n++;
  }
  return n;
}

/**
 * Indices of sentence-ending tokens — for the editor's opt-in "auto-mark sentence
 * stops" action. Timing never reads punctuation directly; this only suggests stops
 * the author can then keep or remove.
 */
export function sentenceStopIndices(tokens: ReadonlyArray<{ v: string }>): number[] {
  const indices: number[] = [];
  tokens.forEach((token, i) => {
    if (classifyBoundary(token.v) === "sentence") indices.push(i);
  });
  return indices;
}
