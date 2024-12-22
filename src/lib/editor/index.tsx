import { EditorProvider } from "@/contexts/editor";
import { RawSpeedDocument } from "@/models/speed-document";
import React from "react";
import { Editor as EditorComponent, EditorProps } from "./editor";
import raw from "./example.txt?raw";

const DEFAULT_DOCUMENT: RawSpeedDocument = {
  title: "New Document",
  raw,
};

export const Editor: React.FC<EditorProps> = (props) => {
  return (
    <EditorProvider defaultDocument={DEFAULT_DOCUMENT}>
      <EditorComponent {...props} />
    </EditorProvider>
  );
};
