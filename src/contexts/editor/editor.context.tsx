import { ObjectState } from "@/hooks/use-object-state";
import { StringHistory } from "@/hooks/use-string-history";
import { RawSpeedDocument } from "@/models/speed-document";
import { Token } from "@/models/token";
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
  /** Tokens derived from the raw text, annotated with manual `stop` flags. */
  documentTokens: Token[];
  /** Toggle the `stop` flag on the token at the given index. */
  toggleStop: (index: number) => void;
  /** Remove all stop flags. */
  clearStops: () => void;
  /** Opt-in: mark every sentence-ending token (except the last) as a stop. */
  autoMarkStops: () => void;
}

export const EditorContext = React.createContext<EditorContextProps | null>(null);
