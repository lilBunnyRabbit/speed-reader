<script lang="ts">
  import { onMount } from "svelte";
  import { index, interval, words, wpm } from "../stores/time.store";
  import { wpmToTimestamp } from "../utils/time.util";

  $: wordCount = $words.length;

  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      console.log({ key: e.key });

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
          index.reset();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<div class="track">
  <input type="range" name="progress" bind:value={$index} min={0} max={wordCount - 1} step="1" />
  <div>{$index + 1} / {wordCount} - {wpmToTimestamp($wpm, $index + 1)} / {wpmToTimestamp($wpm, wordCount)}</div>
</div>

<style lang="scss">
  .track {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  input {
    width: 100%;
  }
</style>
