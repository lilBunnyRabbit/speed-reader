<script lang="ts">
  import { index, interval, words, wpm } from "../stores/time.store";
  import { isUndefined } from "../utils";
  import { wpmToTimestamp } from "../utils/time.util";
  import IconButton from "./buttons/IconButton.svelte";
  import PauseIcon from "./icons/PauseIcon.svelte";
  import PlayIcon from "./icons/PlayIcon.svelte";
  import ArrowBackUpIcon from "./icons/ArrowBackUpIcon.svelte";
  import WpmInput from "./inputs/WpmInput.svelte";

  $: wordCount = $words.length;
</script>

<div class="flex flex-col gap-2 w-full">
  <div class="flex items-center gap-2">
    <input type="range" name="progress" bind:value={$index} min={0} max={wordCount - 1} step="1" />

    <div>{wpmToTimestamp($wpm, wordCount - $index + 1)}</div>
  </div>

  <div class="flex items-center gap-4 justify-between">
    <div class="flex items-center gap-4">
      <IconButton
        variant="transparent"
        data-ignore-key-event
        on:click={() => (isUndefined($interval) ? interval.start() : interval.stop())}
      >
        <svelte:component this={isUndefined($interval) ? PlayIcon : PauseIcon} />
      </IconButton>

      <IconButton
        variant="transparent"
        data-ignore-key-event
        on:click={() => {
          interval.stop();
          index.reset();
        }}
      >
        <ArrowBackUpIcon />
      </IconButton>

      <div>{$index + 1} / {wordCount} words</div>
    </div>

    <WpmInput bind:value={$wpm} />
  </div>
</div>

<style lang="scss">
  input {
    width: 100%;
  }
</style>
