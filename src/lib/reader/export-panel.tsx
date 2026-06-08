import { ConfigInput } from "@/components/config-input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { exportQuoteVideo, ExportResult } from "@/core/export/encode-video";
import { deletePreset, loadPresets, savePreset, VideoPreset } from "@/core/presets";
import { DEFAULT_FRAME_STYLE } from "@/core/render/render-frame";
import { buildTimeline } from "@/core/timeline";
import { SpeedDocument } from "@/models/speed-document";
import { FilmIcon, Loader2Icon } from "lucide-react";
import React from "react";

/** The exporter renders with this loaded webfont (matches the reader's `font-mono`). */
const EXPORT_FONT_FAMILY = '"Roboto Mono"';

function slugify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "quote"
  );
}

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => clampByte(v).toString(16).padStart(2, "0")).join("");
}

/** Read an app theme color (CSS var holds an "R G B" triplet) as a hex string for the color inputs. */
function cssVarToHex(name: string, fallback: string): string {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const parts = raw.split(/[\s,/]+/).map(Number).filter((n) => !Number.isNaN(n));
    if (parts.length >= 3) return rgbToHex(parts[0], parts[1], parts[2]);
  } catch {
    /* ignore */
  }
  return fallback;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export interface ExportPanelProps {
  doc: SpeedDocument;
  /** Default export WPM (the reader's current WPM). */
  wpm: number;
  /** Hold (ms) after stop tokens. */
  stopMs: number;
  /** Loop-safe end hold (ms). */
  endHoldMs: number;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ doc, wpm, stopMs, endHoldMs }) => {
  const [width, setWidth] = React.useState(DEFAULT_FRAME_STYLE.width);
  const [height, setHeight] = React.useState(DEFAULT_FRAME_STYLE.height);
  const [exportWpm, setExportWpm] = React.useState(wpm);
  const [bg, setBg] = React.useState(() => cssVarToHex("--color-background", "#0d0d10"));
  const [text, setText] = React.useState(() => cssVarToHex("--color-foreground", "#f5f5f4"));
  const [attribution, setAttribution] = React.useState("");
  const [watermark, setWatermark] = React.useState("");
  const [showGhosts, setShowGhosts] = React.useState(false);
  const [endCard, setEndCard] = React.useState(true);
  const [exporting, setExporting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<ExportResult | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  const [presets, setPresets] = React.useState<VideoPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = React.useState("");
  const [presetName, setPresetName] = React.useState("");

  React.useEffect(() => setPresets(loadPresets()), []);

  const words = React.useMemo(() => doc.tokens.map((token) => token.v), [doc.tokens]);
  const timeline = React.useMemo(
    () => buildTimeline(doc.tokens, exportWpm > 0 ? exportWpm : 1, { stopMs, endHoldMs }),
    [doc.tokens, exportWpm, stopMs, endHoldMs]
  );

  const onNumber = React.useCallback(
    (set: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.valueAsNumber;
      if (!Number.isNaN(value)) set(value);
    },
    []
  );

  const onExport = React.useCallback(async () => {
    setError(null);
    setDone(null);
    setProgress(0);
    setExporting(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await exportQuoteVideo({
        words,
        timeline,
        attribution: attribution.trim() || undefined,
        options: {
          fps: 30,
          endHoldMs,
          endCard,
          style: {
            width: Math.round(width),
            height: Math.round(height),
            background: bg,
            wordColor: text,
            attributionColor: hexToRgba(text, 0.6),
            watermarkColor: hexToRgba(text, 0.32),
            ghostColor: hexToRgba(text, 0.18),
            showGhosts,
            watermark: watermark.trim() || null,
          },
          signal: controller.signal,
          onProgress: setProgress,
          ensureFontsReady: async () => {
            await Promise.all([
              document.fonts.load(`${DEFAULT_FRAME_STYLE.fontWeight} ${DEFAULT_FRAME_STYLE.maxWordSize}px ${EXPORT_FONT_FAMILY}`),
              document.fonts.load(`500 ${DEFAULT_FRAME_STYLE.attributionSize}px ${EXPORT_FONT_FAMILY}`),
            ]);
            await document.fonts.ready;
          },
        },
      });

      triggerDownload(result.blob, `${slugify(attribution || doc.title || "quote")}.${result.extension}`);
      setDone(result);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") {
        setError("Export canceled.");
      } else {
        setError(caught instanceof Error ? caught.message : "Export failed.");
      }
    } finally {
      setExporting(false);
      abortRef.current = null;
    }
  }, [words, timeline, attribution, endHoldMs, endCard, width, height, bg, text, showGhosts, watermark, doc.title]);

  const onCancel = React.useCallback(() => abortRef.current?.abort(), []);

  const applyPreset = React.useCallback(
    (id: string) => {
      setSelectedPresetId(id);
      const preset = presets.find((p) => p.id === id);
      if (!preset) return;
      const s = preset.settings;
      setWidth(s.width);
      setHeight(s.height);
      setExportWpm(s.wpm);
      setBg(s.background);
      setText(s.text);
      setWatermark(s.watermark);
      setShowGhosts(s.showGhosts);
      setEndCard(s.endCard);
      setPresetName(preset.name);
    },
    [presets]
  );

  const onSavePreset = React.useCallback(() => {
    const name = presetName.trim();
    if (!name) return;
    const existing = presets.find((p) => p.name.toLowerCase() === name.toLowerCase());
    const preset: VideoPreset = {
      id: existing?.id ?? crypto.randomUUID(),
      name,
      settings: {
        width: Math.round(width),
        height: Math.round(height),
        wpm: exportWpm,
        background: bg,
        text,
        watermark,
        showGhosts,
        endCard,
      },
      updatedAt: Date.now(),
    };
    setPresets(savePreset(preset));
    setSelectedPresetId(preset.id);
  }, [presetName, presets, width, height, exportWpm, bg, text, watermark, showGhosts, endCard]);

  const onDeletePreset = React.useCallback(() => {
    if (!selectedPresetId) return;
    setPresets(deletePreset(selectedPresetId));
    setSelectedPresetId("");
  }, [selectedPresetId]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost-icon" title="Export video">
          <FilmIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Export video</SheetTitle>
          <SheetDescription>Render a vertical Short with stop-token pauses and a loop-safe end hold.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2 border-b border-foreground/20 pb-4">
            <span className="text-sm font-medium">Preset</span>
            <div className="flex gap-2">
              <select
                className="flex-1 bg-transparent border border-foreground/30 rounded px-2 py-1"
                value={selectedPresetId}
                onChange={(e) => applyPreset(e.target.value)}
              >
                <option value="">Load a preset…</option>
                {presets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" disabled={!selectedPresetId} onClick={onDeletePreset}>
                Delete
              </Button>
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-transparent border border-foreground/30 rounded px-2 py-1"
                placeholder="Preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
              />
              <Button variant="secondary" size="sm" disabled={!presetName.trim()} onClick={onSavePreset}>
                Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ConfigInput className="[&_input]:!w-full" min={120} max={4096} step={20} value={width} onChange={onNumber(setWidth)}>
              Width
            </ConfigInput>
            <ConfigInput className="[&_input]:!w-full" min={120} max={4096} step={20} value={height} onChange={onNumber(setHeight)}>
              Height
            </ConfigInput>
          </div>

          <ConfigInput
            className="[&_input]:!w-full"
            tooltip="Export speed (words per minute). Defaults to the reader's WPM."
            min={1}
            max={1200}
            step={10}
            value={exportWpm}
            onChange={onNumber(setExportWpm)}
          >
            WPM
          </ConfigInput>

          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center justify-between gap-2">
              <span className="text-sm">Background</span>
              <input type="color" className="h-8 w-12 bg-transparent" value={bg} onChange={(e) => setBg(e.target.value)} />
            </label>
            <label className="flex items-center justify-between gap-2">
              <span className="text-sm">Text</span>
              <input type="color" className="h-8 w-12 bg-transparent" value={text} onChange={(e) => setText(e.target.value)} />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Attribution</span>
            <input
              className="bg-transparent border border-foreground/30 rounded px-2 py-1"
              placeholder="— Author"
              value={attribution}
              onChange={(e) => setAttribution(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm">Watermark / handle</span>
            <input
              className="bg-transparent border border-foreground/30 rounded px-2 py-1"
              placeholder="@yourchannel"
              value={watermark}
              onChange={(e) => setWatermark(e.target.value)}
            />
          </label>

          <label className="flex items-center justify-between gap-2 cursor-pointer select-none">
            <span>Full-quote end card</span>
            <input
              type="checkbox"
              className="size-4 accent-foreground"
              checked={endCard}
              onChange={(e) => setEndCard(e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between gap-2 cursor-pointer select-none">
            <span>Ghost words</span>
            <input
              type="checkbox"
              className="size-4 accent-foreground"
              checked={showGhosts}
              onChange={(e) => setShowGhosts(e.target.checked)}
            />
          </label>

          {exporting ? (
            <div className="flex flex-col gap-2">
              <div className="h-2 rounded bg-foreground/20 overflow-hidden">
                <div
                  className="h-full bg-foreground transition-[width]"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm font-mono">
                <span className="flex items-center gap-1">
                  <Loader2Icon className="size-4 animate-spin" /> Rendering…
                </span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={onExport} disabled={timeline.count === 0}>
              Export MP4
            </Button>
          )}

          {error && <div className="text-sm text-error">{error}</div>}
          {done && (
            <div className="text-sm text-success font-mono">
              Done · {done.extension.toUpperCase()} · {done.width}×{done.height} · {(done.durationMs / 1000).toFixed(1)}s
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
