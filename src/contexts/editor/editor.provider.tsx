import { useAutoResize } from "@/hooks/use-auto-resize";
import { useObjectState } from "@/hooks/use-object-state";
import { useStringHistory } from "@/hooks/use-string-history";
import { RawSpeedDocument } from "@/models/speed-document";
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

  const ref = React.useRef<HTMLTextAreaElement>(null);
  useAutoResize(ref);

  const rawDocument: RawSpeedDocument = React.useMemo(
    () => ({
      title,
      raw: contentHistory.value,
    }),
    [contentHistory.value, title]
  );

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
      }}
      children={children}
    />
  );
};
