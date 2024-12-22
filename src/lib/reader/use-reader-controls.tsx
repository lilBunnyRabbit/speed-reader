import { useBindState } from "@/hooks/use-bind-state";
import { SpeedDocument } from "@/models/speed-document";
import { isNull, isUndefined } from "@lilbunnyrabbit/utils";
import React from "react";

const hasInterval = (value: NodeJS.Timeout | null): value is NodeJS.Timeout => {
  return !isUndefined(value) && !isNull(value);
};

const clearIntervalRef = (ref: React.MutableRefObject<NodeJS.Timeout | null>) => {
  if (hasInterval(ref.current)) {
    clearInterval(ref.current);
    ref.current = null;
  }
};

export function useReaderSettings() {
  const wpm = useBindState<number>(300);
  const ghostWords = useBindState<number>(3);

  return { wpm, ghostWords };
}

export function useReaderControls(document: SpeedDocument, settings: ReturnType<typeof useReaderSettings>) {
  const [status, setStatus] = React.useState<"paused" | "playing">("paused");
  const [index, setIndex] = React.useState(0);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    console.log("bindWpm.value", settings.wpm.value);
  }, [settings.wpm.value]);

  const stop = React.useCallback(() => {
    clearIntervalRef(intervalRef);
    setStatus("paused");
  }, []);

  const start = React.useCallback(() => {
    clearIntervalRef(intervalRef);

    if (isUndefined(settings.wpm.value)) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setIndex((index) => {
        if (index >= document.tokens.length - 1) {
          stop();
          return index;
        }

        return index + 1;
      });
    }, 60000 / settings.wpm.value);

    setStatus("playing");
  }, [document.tokens.length, settings.wpm.value, stop]);

  React.useEffect(() => {
    if (!hasInterval(intervalRef.current)) return;

    start();

    return stop;
  }, [start, stop]);

  const toggle = React.useCallback(() => {
    if (hasInterval(intervalRef.current)) {
      return stop();
    }

    return start();
  }, [start, stop]);

  return { index, setIndex, start, stop, toggle, status } as const;
}
