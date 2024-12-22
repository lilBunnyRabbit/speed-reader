import { useAutoResize } from "@/hooks/use-auto-resize";
import { TextIcon } from "lucide-react";
import React from "react";
import { cn } from "../utils";
import { EditorToolbar } from "./toolbar";
import { useEditor } from "@/contexts/editor";
import { Button } from "@/components/ui/button";
import { SpeedDocumentBuilder } from "@/models/speed-document";
import { useGlobalReader } from "@/contexts/global-reader";
import { useNavigate } from "react-router";
import { TokenPreview } from "./token-preview";
import { ThemeToggle } from "@/components/theme-toggle";

export interface EditorProps {
  banana?: string;
}

export const Editor: React.FC<EditorProps> = () => {
  const { setDocument } = useGlobalReader();
  const { ref, rawDocument, settings, setContent, history, editType } = useEditor();
  const navigate = useNavigate();

  useAutoResize(ref);

  React.useEffect(() => {
    document.body.classList.add("overflow-body");

    return () => {
      document.body.classList.remove("overflow-body");
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 backdrop-blur px-6 pt-6 supports-backdrop-blur:bg-background/95">
        <div className="container">
          <div className="grid grid-cols-[min-content,min-content,min-content,1fr] items-center gap-2 mb-1">
            <TextIcon />
            <h3 contentEditable suppressContentEditableWarning={true} className="whitespace-nowrap">
              {rawDocument.title}
            </h3>

            <Button
              className="mr-8"
              size="sm"
              onClick={() => {
                const document = SpeedDocumentBuilder.build(rawDocument);
                setDocument(document);
                navigate("/reader");
              }}
            >
              Read
            </Button>

            <ThemeToggle className="justify-self-end" />
          </div>

          <EditorToolbar />
        </div>
      </div>

      <div className="cursor-text pt-24 pb-[50%] container" onClick={() => ref.current?.focus()}>
        <div className={cn("", !settings.values.fullWidth && "container max-w-6xl", editType !== "raw" && "hidden")}>
          <textarea
            ref={ref}
            className={cn(
              "w-full bg-transparent resize-none outline-none caret-primary text-justify selection:bg-primary selection:text-background overflow-hidden"
            )}
            value={rawDocument.raw}
            onChange={(e) => setContent(e.target.value)}
            onInput={(e) => {
              e.bubbles = false;
            }}
            onKeyDown={(e) => {
              if (e.ctrlKey) {
                switch (e.code) {
                  case "KeyZ": {
                    if (history.undoCount) {
                      e.preventDefault();
                      return history.undo();
                    }
                    break;
                  }

                  case "KeyY": {
                    if (history.redoCount) {
                      e.preventDefault();
                      return history.redo();
                    }
                    break;
                  }

                  default:
                    break;
                }
              }
            }}
          />
        </div>

        {editType === "tokens" && <TokenPreview value={rawDocument.raw} />}
      </div>
    </>
  );
};
