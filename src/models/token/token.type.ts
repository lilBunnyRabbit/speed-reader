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

  /* Temporary */

  /**
   * Index
   */
  i?: number;
}
