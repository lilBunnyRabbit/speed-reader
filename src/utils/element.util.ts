export function updateTextAreaHeight(
  textarea: HTMLTextAreaElement | null | undefined,
  initial?: boolean,
  scrollBottom?: boolean
) {
  if (!textarea) return;

  if (!initial) {
    textarea.style.height = "auto";
  }
  textarea.style.height = textarea.scrollHeight + "px";

  if (scrollBottom) {
    const parentsParent = textarea.parentElement?.parentElement;
    if (parentsParent) {
      parentsParent.scrollTop = parentsParent.scrollHeight;
    }
  }
}
