import { index, interval, wpm } from "../stores/time.store";

export function keyEvents(_: Node) {
  const handleKeydown = (e: KeyboardEvent) => {
    if ("ignoreKeyEvent" in (e.target as HTMLElement).dataset) {
      return;
    }

    switch (e.key) {
      case "ArrowRight":
        interval.stop();
        index.update((i) => i + 1);
        break;

      case "ArrowLeft":
        interval.stop();
        index.update((i) => i - 1);
        break;

      case "ArrowUp":
        wpm.update((wpm) => wpm + 25);
        break;

      case "ArrowDown":
        wpm.update((wpm) => wpm - 25);
        break;

      case " ":
        interval.toggle();
        break;

      case "Backspace":
        interval.stop();
        index.reset();
        break;

      default:
        break;
    }
  };

  window.addEventListener("keydown", handleKeydown);

  return {
    destroy() {
      window.removeEventListener("keydown", handleKeydown);
    },
  };
}
