import { useStack } from "@/hooks/use-stack";
import { isFunction, isNull } from "@lilbunnyrabbit/utils";
import React from "react";

export interface StringHistory {
  value: string;
  set: React.Dispatch<React.SetStateAction<string>>;
  undo: () => void;
  undoCount: number;
  redo: () => void;
  redoCount: number;
}

export function useStringHistory(defaultValue: string, maxStack: number = 10): StringHistory {
  const [internal, setInternal] = React.useState<string>(defaultValue);

  const undoStack = useStack<string>(maxStack);
  const redoStack = useStack<string>(maxStack);

  const set: StringHistory["set"] = React.useCallback(
    (value) => {
      const updatedContent = isFunction(value) ? value(internal) : value;

      if (updatedContent !== internal) {
        undoStack.push(internal);
        setInternal(updatedContent);
        redoStack.clear();
      }
    },
    [internal, redoStack, undoStack]
  );

  const undo = React.useCallback(() => {
    if (!undoStack.size) return;

    const previousContent = undoStack.pop();
    if (isNull(previousContent)) return;

    redoStack.push(internal);
    setInternal(previousContent);
  }, [internal, redoStack, undoStack]);

  const redo = React.useCallback(() => {
    if (!redoStack.size) return;

    const nextContent = redoStack.pop();
    if (isNull(nextContent)) return;

    undoStack.push(internal);
    setInternal(nextContent);
  }, [internal, redoStack, undoStack]);

  return {
    value: internal,
    set,
    undo,
    undoCount: undoStack.size,
    redo,
    redoCount: redoStack.size,
  };
}
