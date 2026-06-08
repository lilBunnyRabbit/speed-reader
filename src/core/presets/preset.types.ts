/**
 * Named, reusable export-look presets.
 *
 * Captures the channel/format look (resolution, pacing, colors, branding) — NOT
 * quote-specific content like attribution. Framework-agnostic and JSON-serializable,
 * so the same shape backs localStorage now and survives a future store swap / rewrite.
 */

export interface VideoPresetSettings {
  width: number;
  height: number;
  wpm: number;
  /** Background color (hex). */
  background: string;
  /** Text color (hex). */
  text: string;
  /** Channel handle/watermark, or "" for none. */
  watermark: string;
  showGhosts: boolean;
  endCard: boolean;
}

export interface VideoPreset {
  id: string;
  name: string;
  settings: VideoPresetSettings;
  /** Epoch ms of the last save. */
  updatedAt?: number;
}
