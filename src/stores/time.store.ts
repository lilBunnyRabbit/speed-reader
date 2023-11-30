import { derived, get, writable, type Updater } from "svelte/store";
import { debugLog, isUndefined } from "../utils";

export const MAX_WPM = 1200;

function createWpmStore(initial: number) {
  const wpm = writable(initial);

  return {
    subscribe: wpm.subscribe,
    update: (updater: Updater<number>) => {
      wpm.update((index) => {
        const value = updater(index);
        return value < 0 ? 0 : value > MAX_WPM ? MAX_WPM : value;
      });
    },
    set: (value: number) => {
      wpm.set(value < 0 ? 0 : value > MAX_WPM ? MAX_WPM : value);
    },
  };
}

export const wpm = createWpmStore(300);
export const words = writable<string[]>([]);

const maxIndex = derived(words, ($words) => $words.length - 1);

function createIndexStore(initial: number) {
  const index = writable(initial);

  return {
    subscribe: index.subscribe,
    update: (updater: Updater<number>) => {
      index.update((index) => {
        const value = updater(index);
        const max = get(maxIndex);
        return value < 0 ? 0 : value > max ? max : value;
      });
    },
    set: (value: number) => {
      index.update(() => {
        const max = get(maxIndex);
        return value < 0 ? 0 : value > max ? max : value;
      });
    },
    reset: () => index.set(0),
    isFull: () => {
      return get(index) === get(maxIndex);
    },
  };
}

export const index = createIndexStore(0);

function createIntervalStore() {
  const interval = writable<number | undefined>();

  function stop() {
    const intervalID = get(interval);
    debugLog("interval::stop", { id: intervalID });

    if (!isUndefined(intervalID)) {
      clearInterval(intervalID);
      interval.set(undefined);
    }
  }

  function start() {
    stop();

    const wordsPerMinute = get(wpm) ?? 0;
    debugLog("interval::start", { wpm: wordsPerMinute });

    if (index.isFull() || wordsPerMinute === 0) return;

    const intervalID = setInterval(() => {
      if (index.isFull()) {
        return stop();
      }

      index.update((v) => v + 1);
    }, 60000 / wordsPerMinute);

    interval.set(intervalID);
  }

  const unsubscribe = wpm.subscribe(($wpm) => {
    if (!isUndefined(get(interval))) {
      return start();
    }
  });

  return {
    ...interval,
    start,
    stop,
    toggle: () => {
      const intervalID = get(interval);
      if (isUndefined(intervalID)) {
        return start();
      }

      return stop();
    },
    destroy: () => {
      debugLog("interval::destroy", get(wpm));

      unsubscribe();
      stop();
    },
  };
}

export const interval = createIntervalStore();
