import React from "react";
import { Reader as ReaderComponent, ReaderProps } from "./reader";

export const Reader: React.FC<ReaderProps> = (props) => {
  return <ReaderComponent {...props} />;
};
