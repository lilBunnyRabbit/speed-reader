import { writable, type Updater } from "svelte/store";
import { isUndefined } from "../utils";

function createMinMaxStore(initial: number, { min, max }: Partial<Record<"min" | "max", number>> = {}) {
  const value = writable(initial);

  const validateValue = (v: number) => {
    if (v == undefined || v === null) {
      return min ?? initial;
    }

    if (!isUndefined(min) && v < min) {
      return min;
    }

    if (!isUndefined(max) && v > max) {
      return max;
    }

    return v;
  };

  return {
    subscribe: value.subscribe,
    update: (updater: Updater<number>) => {
      value.update((index) => {
        const newValue = updater(index);
        return validateValue(newValue);
      });
    },
    set: (newValue: number) => {
      value.set(validateValue(newValue));
    },
  };
}

export const settingGhostWords = createMinMaxStore(3, { min: 0 });
