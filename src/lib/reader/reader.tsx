import { ConfigInput } from "@/components/config-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { SpeedDocument } from "@/models/speed-document";
import { wpmToTimeString } from "@/utils/time.util";
import {
  PauseIcon,
  PlayIcon,
  Settings2Icon,
  SkipBackIcon,
  SkipForwardIcon,
  StepBackIcon,
  StepForwardIcon,
} from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { GhostWordsComponent, TokenComponent } from "./token";
import { useReaderControls, useReaderSettings } from "./use-reader-controls";

export interface ReaderProps {
  document: SpeedDocument;
}

export const Reader: React.FC<ReaderProps> = ({ document }) => {
  const settings = useReaderSettings();
  const controls = useReaderControls(document, settings);

  return (
    <div className="w-full grid grid-cols-1 grid-rows-[min-content,1fr,min-content] p-6">
      <div className="container flex items-center justify-evenly sm:justify-start gap-6">
        <Sheet
          onOpenChange={(open) => {
            if (open) {
              controls.stop();
            }
          }}
        >
          <Link to="/editor">Editor</Link>

          <ConfigInput min={1} max={1200} step={50} {...settings.wpm}>
            WPM
          </ConfigInput>

          <SheetTrigger asChild>
            <Button size="icon" variant="ghost-icon" className="self-end">
              <Settings2Icon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>This are the reader settings.</SheetDescription>
            </SheetHeader>

            <ConfigInput className="[&_input]:!w-full" min={0} {...settings.ghostWords}>
              Ghost Words
            </ConfigInput>
          </SheetContent>
        </Sheet>
        <ThemeToggle className="justify-self-end" />
      </div>

      <div
        className="grid grid-cols-[1fr,min-content,1fr] items-baseline place-content-center gap-4"
        onClick={() => controls.toggle()}
      >
        <GhostWordsComponent
          className="truncate text-lg opacity-40 text-right [direction:rtl]"
          tokens={document.tokens}
          index={controls.index}
          count={settings.ghostWords.value ?? 0}
          type="prefix"
        />
        <TokenComponent className="text-center text-5xl whitespace-nowrap" token={document.tokens[controls.index]} />
        <GhostWordsComponent
          className="truncate text-lg opacity-40 text-left"
          tokens={document.tokens}
          index={controls.index}
          count={settings.ghostWords.value ?? 0}
          type="suffix"
        />
      </div>

      <div className="container flex flex-col">
        <div className="grid grid-cols-[repeat(5,min-content)] place-items-center items-center justify-evenly sm:justify-center gap-2 mb-4">
          <Button
            size="icon"
            variant="ghost-icon"
            onClick={() => {
              controls.stop();
              controls.setIndex(0);
            }}
          >
            <SkipBackIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost-icon"
            onClick={() => {
              controls.stop();
              controls.setIndex(Math.max(0, controls.index - 1));
            }}
          >
            <StepBackIcon />
          </Button>
          <Button size="icon" variant="rounded-icon" onClick={controls.toggle}>
            {controls.status === "playing" ? (
              <PauseIcon className="fill-current" />
            ) : (
              <PlayIcon className="fill-current" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost-icon"
            onClick={() => {
              controls.stop();
              controls.setIndex(Math.min(document.tokens.length - 1, controls.index + 1));
            }}
          >
            <StepForwardIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost-icon"
            onClick={() => {
              controls.stop();
              controls.setIndex(document.tokens.length - 1);
            }}
          >
            <SkipForwardIcon />
          </Button>
        </div>

        <Slider
          value={[controls.index]}
          max={document.tokens.length - 1}
          min={0}
          step={1}
          onValueChange={(v) => controls.setIndex(v[0])}
        />
        <div className="flex justify-between mt-2">
          <div className="text-sm font-mono">{wpmToTimeString(settings.wpm.value ?? 0, document.tokens.length)}</div>

          <div className="text-sm font-mono whitespace-nowrap">
            {controls.index + 1} / {document.tokens.length}
          </div>
        </div>
      </div>
    </div>
  );
};
