<script lang="ts">
  import { index, words, wpm } from "../stores/time.store";
  import { cx } from "../utils/class.util";
  import { wpmToTimeString, wpmToTimestamp } from "../utils/time.util";
  import IconButton from "./buttons/IconButton.svelte";
  import EyeClosedIcon from "./icons/EyeClosedIcon.svelte";
  import EyeIcon from "./icons/EyeIcon.svelte";

  let open = true;

  $: icon = open ? EyeIcon : EyeClosedIcon;

  $: wordCount = $words.length;
  $: progress = Math.floor((($index + 1) / wordCount) * 100);
  $: timeToRead = wpmToTimeString($wpm, wordCount);
</script>

<div class={cx("p-2 whitespace-nowrap", open && "border-r border-b", $$props.class)}>
  <div class={cx(open && "flex items-center border-b gap-2 pb-1 mb-1")}>
    <IconButton on:click={() => (open = !open)} variant="transparent">
      <svelte:component this={icon} />
    </IconButton>

    {#if open}
      <h3 class="font-medium text-lg">Stats</h3>
    {/if}
  </div>

  {#if open}
    <div>
      <div><span class="font-medium">Time to Read:</span> {timeToRead}</div>
      <div><span class="font-medium">Word Count:</span> {wordCount}</div>
      <div><span class="font-medium">Progress:</span> {progress}%</div>
      <div><span class="font-medium">WPM:</span> {$wpm}</div>
    </div>
  {/if}
</div>
