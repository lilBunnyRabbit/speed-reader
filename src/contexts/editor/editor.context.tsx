import { ObjectState } from "@/hooks/use-object-state";
import { StringHistory } from "@/hooks/use-string-history";
import { RawSpeedDocument } from "@/models/speed-document";
import React from "react";

export interface EditorContextProps {
  ref: React.RefObject<HTMLTextAreaElement>;
  rawDocument: RawSpeedDocument;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  history: StringHistory;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  settings: ObjectState<{ fullWidth: boolean }>;
  editType: "raw" | "tokens";
  setEditType: React.Dispatch<React.SetStateAction<"raw" | "tokens">>;
}

export const EditorContext = React.createContext<EditorContextProps | null>(null);
