import React from "react";
import { GlobalReaderContext } from "./global-reader.context";

export const useGlobalReader = () => {
  const context = React.useContext(GlobalReaderContext);
  if (!context) {
    throw new Error("useGlobalReader must be used within GlobalReaderProvider");
  }

  return context;
};
