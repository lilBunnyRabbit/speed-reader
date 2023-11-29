<script lang="ts">
  import { onMount } from "svelte";
  import { index, interval, words, wpm } from "../stores/time.store";
  import { isUndefined } from "../utils";
  import Track from "./Track.svelte";
  import WordsDisplay from "./WordsDisplay.svelte";

  onMount(() => {
    return () => {
      interval.destroy();
    };
  });
</script>

<main id="speed-reader">
  <WordsDisplay />

  <Track />

  <div style:display="flex" style:gap="1rem" style:align-items="center">
    <button
      style:cursor="pointer"
      disabled={$index >= $words.length - 1}
      on:click={(e) => {
        e.preventDefault();
        e.stopPropagation();

        isUndefined($interval) ? interval.start() : interval.stop();
      }}
    >
      {isUndefined($interval) ? "Start" : "Stop"}
    </button>

    <input type="number" bind:value={$wpm} /> WPM
  </div>
</main>

<style lang="scss">
  main#speed-reader {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    // border: 1px solid gray;
    gap: 1rem;
    align-items: center;
  }

  button {
    width: fit-content;
    padding: 0.5rem 1rem;
  }

  input {
    width: 100%;
  }
</style>
