<script lang="ts">
  import { settingGhostWords } from "../stores/settings.store";
  import { index, words } from "../stores/time.store";

  $: lastN = $settingGhostWords
    ? Array($settingGhostWords)
        .fill(0)
        .map((_, i) => $words[$index - ($settingGhostWords - i)])
        .filter(Boolean)
        .join(" ")
    : "";

  $: nextN = $settingGhostWords
    ? Array($settingGhostWords)
        .fill(0)
        .map((_, i) => $words[$index + i + 1])
        .filter(Boolean)
        .join(" ")
    : "";
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
    column-gap: 1rem;
    align-items: baseline;
    align-content: center;
    flex: 1 1 0%;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
