<script lang="ts">
  import { onMount } from "svelte";
  import { keyEvents } from "../actions/keyEvents.action";
  import ProgressTrack from "../components/ProgressTrack.svelte";
  import WordsDisplay from "../components/WordsDisplay.svelte";
  import { index, interval, words, wpm } from "../stores/time.store";
  import { isUndefined } from "../utils";
  import Button from "../components/buttons/Button.svelte";

  onMount(() => {
    return () => {
      interval.destroy();
    };
  });
</script>

<main id="speed-reader" use:keyEvents>
  <WordsDisplay />

  <ProgressTrack />

  <div style:display="flex" style:gap="1rem" style:align-items="center">
    <Button
      disabled={$index >= $words.length - 1}
      data-ignore-key-event
      on:click={() => {
        isUndefined($interval) ? interval.start() : interval.stop();
      }}
    >
      {isUndefined($interval) ? "Start" : "Stop"}
    </Button>

    <input type="number" bind:value={$wpm} data-ignore-key-event /> WPM
  </div>
</main>

<style lang="scss">
  main#speed-reader {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 1rem;
    align-items: center;
    overflow: hidden;
  }

  input {
    width: 100%;
  }
</style>
