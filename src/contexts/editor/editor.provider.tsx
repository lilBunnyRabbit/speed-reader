import { useAutoResize } from "@/hooks/use-auto-resize";
import { useObjectState } from "@/hooks/use-object-state";
import { useStringHistory } from "@/hooks/use-string-history";
import { sentenceStopIndices } from "@/core/timeline";
import { RawSpeedDocument, SpeedDocumentBuilder } from "@/models/speed-document";
import { updateTextAreaHeight } from "@/utils/element.util";
import React from "react";
import { EditorContext } from "./editor.context";

export interface EditorProviderProps {
  children: React.ReactNode;
  defaultDocument: RawSpeedDocument;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children, defaultDocument }) => {
  const settings = useObjectState({ fullWidth: true });
  const [title, setTitle] = React.useState<string>(defaultDocument.title);
  const contentHistory = useStringHistory(defaultDocument.raw, 10);
  const [editType, setEditType] = React.useState<"raw" | "tokens">("raw");

  // Manual "stop" markers, by token index. Tokens are derived from the raw text, so
  // when the raw text changes the indices would no longer line up — reset them.
  const [stops, setStops] = React.useState<Set<number>>(() => new Set());
  const rawRef = React.useRef(contentHistory.value);
  React.useEffect(() => {
    if (rawRef.current !== contentHistory.value) {
      rawRef.current = contentHistory.value;
      setStops(new Set());
    }
  }, [contentHistory.value]);

  const ref = React.useRef<HTMLTextAreaElement>(null);
  useAutoResize(ref);

  const rawDocument: RawSpeedDocument = React.useMemo(
    () => ({
      title,
      raw: contentHistory.value,
    }),
    [contentHistory.value, title]
  );

  const documentTokens = React.useMemo(() => {
    const tokens = SpeedDocumentBuilder.build(rawDocument).tokens;
    for (const index of stops) {
      if (tokens[index]) tokens[index].stop = true;
    }
    return tokens;
  }, [rawDocument, stops]);

  const toggleStop = React.useCallback((index: number) => {
    setStops((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const clearStops = React.useCallback(() => setStops(new Set()), []);

  const autoMarkStops = React.useCallback(() => {
    const last = documentTokens.length - 1;
    setStops(new Set(sentenceStopIndices(documentTokens).filter((i) => i !== last)));
  }, [documentTokens]);

  React.useEffect(() => {
    updateTextAreaHeight(ref?.current, false, true);
  }, [contentHistory.value]);

  return (
    <EditorContext.Provider
      value={{
        ref,
        rawDocument,
        setTitle,
        history: contentHistory,
        settings,
        setContent: contentHistory.set,
        editType,
        setEditType,
        documentTokens,
        toggleStop,
        clearStops,
        autoMarkStops,
      }}
      children={children}
    />
  );
};
