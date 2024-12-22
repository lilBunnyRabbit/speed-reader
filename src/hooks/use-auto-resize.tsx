import { updateTextAreaHeight } from "@/utils/element.util";
import React from "react";

export function useAutoResize(ref: React.RefObject<HTMLTextAreaElement>) {
  React.useEffect(() => {
    if (!ref.current) return;

    const textarea = ref.current;
    updateTextAreaHeight(textarea, true);

    function onInput(this: HTMLTextAreaElement) {
      updateTextAreaHeight(this);
    }

    textarea.addEventListener("input", onInput.bind(textarea));

    return () => {
      textarea.removeEventListener("input", onInput.bind(textarea));
    };
  }, [ref]);
}
