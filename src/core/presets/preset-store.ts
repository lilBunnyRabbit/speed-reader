import { VideoPreset } from "./preset.types";

/**
 * localStorage-backed CRUD for {@link VideoPreset}s.
 *
 * Text-only and tiny; localStorage is plenty. All access is guarded so it degrades to
 * an in-memory no-op where storage is unavailable (private mode, SSR, quota). This is
 * the first persistence in the app and the seed for the future quote library.
 */
const STORAGE_KEY = "speedbooks.videoPresets.v1";

function available(): boolean {
  return typeof localStorage !== "undefined";
}

export function loadPresets(): VideoPreset[] {
  if (!available()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as VideoPreset[]) : [];
  } catch {
    return [];
  }
}

function persist(presets: VideoPreset[]): void {
  if (!available()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {
    /* ignore quota / availability errors */
  }
}

/** Insert a new preset or replace the existing one with the same id. Returns the updated list. */
export function savePreset(preset: VideoPreset): VideoPreset[] {
  const presets = loadPresets();
  const index = presets.findIndex((p) => p.id === preset.id);
  if (index >= 0) presets[index] = preset;
  else presets.push(preset);
  persist(presets);
  return presets;
}

/** Delete a preset by id. Returns the updated list. */
export function deletePreset(id: string): VideoPreset[] {
  const presets = loadPresets().filter((p) => p.id !== id);
  persist(presets);
  return presets;
}
