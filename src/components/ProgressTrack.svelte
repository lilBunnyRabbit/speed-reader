<script lang="ts">
  import { index, words, wpm } from "../stores/time.store";
  import { wpmToTimestamp } from "../utils/time.util";

  $: wordCount = $words.length;
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
