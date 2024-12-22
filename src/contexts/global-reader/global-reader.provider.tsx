import React from "react";
import { GlobalReaderContext, GlobalReaderContextProps } from "./global-reader.context";
import { Outlet } from "react-router";

export interface GlobalReaderProviderProps {
  children: React.ReactNode;
}

export const GlobalReaderProvider: React.FC<GlobalReaderProviderProps> = ({ children }) => {
  const [document, setDocument] = React.useState<GlobalReaderContextProps["document"]>(null);

  return <GlobalReaderContext.Provider value={{ document, setDocument }} children={children} />;
};

export const GlobalReaderProviderOutlet: React.FC = () => {
  return (
    <GlobalReaderProvider>
      <Outlet />
    </GlobalReaderProvider>
  );
};
