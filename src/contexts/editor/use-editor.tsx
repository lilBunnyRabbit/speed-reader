import React from "react";
import { EditorContext } from "./editor.context";

export const useEditor = () => {
  const context = React.useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }

  const actions = React.useMemo(() => {
    return {
      removeTimestamps: () => {
        context.history.set((content) => {
          return content
            .replace(/^\n*\d{1,2}(:\d{1,2}){1,2}(\.\d{1,3})?(\n|\s)/g, "")
            .replace(/\n\d{1,2}(:\d{1,2}){1,2}(\.\d{1,3})?(\n|\s)/g, "\n");
        });
      },
      removeAdvancedTimestamps: () => {
        context.history.set((content) => {
          const timestampRe = /^\d{1,2}(:\d{1,2}){1,2}(\.\d{1,3})?$/;
          const expandedRe = /^(\d+\s+hours?,\s+)?(\d+\s+minutes?,\s+)?\d+\s+seconds?$/;
          const lines = content.split("\n");
          const result: string[] = [];
          let lastWasTimestamp = false;
          for (const line of lines) {
            if (timestampRe.test(line.trim())) {
              lastWasTimestamp = true;
              continue;
            }
            if (lastWasTimestamp && expandedRe.test(line.trim())) {
              lastWasTimestamp = false;
              continue;
            }
            lastWasTimestamp = false;
            result.push(line);
          }
          return result.join("\n");
        });
      },
      removeNewLines: () => {
        context.history.set((content) => {
          return content.replace(/\n/g, " ");
        });
      },
      clearAll: () => {
        context.history.set("");
      },
    };
  }, [context.history]);

  return { ...context, actions };
};
