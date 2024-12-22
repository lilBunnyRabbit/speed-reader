import { Editor } from "@/lib/editor";
import React from "react";

export default function EditorRoute(): React.ReactNode {
  return (
    <div className="w-full grid p-6 pb-0">
      <Editor />
    </div>
  );
}
