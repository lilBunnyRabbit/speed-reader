export enum TokenEmotion {
  BOLD,
}

export interface Token {
  /**
   * Value
   */
  v: string;
  /**
   * Prefix
   */
  p?: string;
  /**
   * Suffix
   */
  s?: string;
  /**
   * Emotions
   */
  e?: TokenEmotion[];
  /**
   * Stop — when true, playback holds for the configured stop duration after this token.
   * Set manually in the editor ("stop token"); replaces automatic punctuation pauses.
   */
  stop?: boolean;

  /* Temporary */

  /**
   * Index
   */
  i?: number;
}
