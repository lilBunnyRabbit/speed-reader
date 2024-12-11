<script lang="ts">
  import { onMount } from "svelte";
  import { keyEvents } from "../actions/keyEvents.action";
  import ProgressTrack from "../components/ProgressTrack.svelte";
  import StatsDisplay from "../components/StatsDisplay.svelte";
  import WordsDisplay from "../components/WordsDisplay.svelte";
  import { interval } from "../stores/time.store";

  onMount(() => {
    return () => {
      interval.destroy();
    };
  });
</script>

<main id="speed-reader" use:keyEvents>
  <WordsDisplay />

  <ProgressTrack />

  <StatsDisplay class="absolute top-0 left-0" />
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
</style>
