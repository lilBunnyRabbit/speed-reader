import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEditor } from "@/contexts/editor";
import React from "react";
import { cn } from "../utils";

export const TokenPreview: React.FC = () => {
  const { documentTokens, toggleStop, clearStops, autoMarkStops } = useEditor();

  const stopCount = React.useMemo(() => documentTokens.filter((t) => t.stop).length, [documentTokens]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Button size="sm" variant="secondary" onClick={autoMarkStops}>
          Auto-mark sentence stops
        </Button>
        <Button size="sm" variant="ghost" onClick={clearStops} disabled={!stopCount}>
          Clear stops ({stopCount})
        </Button>
        <span className="opacity-60">Click a word → “Stop after” to add a pause.</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {documentTokens.map((token, i) => {
          if (!token.v) return null;

          return (
            <React.Fragment key={`token-${i}`}>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "rounded-md px-2 py-1 text-sm text-background",
                      token.stop
                        ? "bg-info ring-2 ring-info ring-offset-1 ring-offset-background"
                        : "bg-primary hover:bg-info/60 data-[state=open]:bg-info"
                    )}
                  >
                    {token.v}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="rounded-md w-fit flex flex-col gap-2">
                  <pre className="text-sm">
                    "{token.p && <span className="text-error bg-error/10">{token.p.replace(/\s/g, ".")}</span>}
                    {<span className="text-primary">{token.v}</span>}
                    {token.s && <span className="text-error bg-error/10">{token.s.replace(/\s/g, ".")}</span>}"
                  </pre>
                  <Button
                    size="sm"
                    variant={token.stop ? "default" : "secondary"}
                    onClick={() => toggleStop(i)}
                  >
                    {token.stop ? "Remove stop" : "Stop after"}
                  </Button>
                </PopoverContent>
              </Popover>

              {token.stop && (
                <span className="self-center px-0.5 text-info" title="Stop / pause after this word">
                  ❚❚
                </span>
              )}

              {token.s?.includes("\n") && <div className="basis-full h-4" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
