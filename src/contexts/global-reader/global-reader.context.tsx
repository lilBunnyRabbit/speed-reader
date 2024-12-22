import { SpeedDocument } from "@/models/speed-document";
import React from "react";

export interface GlobalReaderContextProps {
  document: SpeedDocument | null;
  setDocument: React.Dispatch<React.SetStateAction<SpeedDocument | null>>;
}

export const GlobalReaderContext = React.createContext<GlobalReaderContextProps | null>(null);
