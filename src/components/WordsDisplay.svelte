<script lang="ts">
  import { index, words } from "../stores/time.store";

  const n = 3;

  $: lastN = Array(n)
    .fill(0)
    .map((_, i) => $words[$index - (n - i)])
    .filter(Boolean)
    .join(" ");

  $: nextN = Array(n)
    .fill(0)
    .map((_, i) => $words[$index + i + 1])
    .filter(Boolean)
    .join(" ");
</script>

<div class="words-display">
  <h2 class="truncate justify-self-end text-lg opacity-40">{lastN}</h2>

  <h1 class="break-all text-center text-5xl">{$words[$index]}</h1>

  <h2 class="truncate justify-self-start text-lg opacity-40">{nextN}</h2>
</div>

<style lang="scss">
  .words-display {
    display: grid;
    grid-template-columns: 1fr fit-content(100%) 1fr;
    column-gap: 0.5rem;
    align-items: baseline;
    align-content: center;
    flex: 1 1 0%;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
