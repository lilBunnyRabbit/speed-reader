import { isUndefined } from "@lilbunnyrabbit/utils";
import React from "react";

export interface StackState<T> {
  push: (item: T) => void;
  pop: () => T | null;
  clear: () => void;
  size: number;
}

export function useStack<T>(maxSize?: number): StackState<T> {
  const [stack, setStack] = React.useState<T[]>([]);

  const push = React.useCallback(
    (item: T) => {
      setStack((stack) => {
        const clone = [...stack, item];

        if (!isUndefined(maxSize) && clone.length > maxSize) {
          clone.shift();
        }

        return clone;
      });
    },
    [maxSize]
  );

  const pop = React.useCallback(() => {
    if (stack.length === 0) {
      return null;
    }

    const item = stack[stack.length - 1];
    setStack((prevStack) => prevStack.slice(0, -1));

    return item;
  }, [stack]);

  const clear = React.useCallback(() => {
    setStack([]);
  }, []);

  return { push, pop, clear, size: stack.length };
}
