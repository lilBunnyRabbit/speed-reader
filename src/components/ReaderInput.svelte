<script lang="ts">
  import { words } from "../stores/time.store";
  import { removeTimestamps } from "../utils/text.util";
  import Button from "./buttons/Button.svelte";

  let text: string;

  const handleSubmit = () => {
    if (!text) return;

    $words = text.trim().split(/\s+/g);
  };
</script>

<div class="grid grid-cols-[1fr,min-content] w-full h-full gap-x-8">
  <textarea class="resize-none" bind:value={text} />

  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col gap-y-2">
      <h2 class="text-center text-lg font-medium border-b border-b-current">Actions</h2>

      <Button
        class="!w-full whitespace-nowrap"
        colorScheme="primary"
        disabled={!text}
        on:click={() => {
          if (!text) return;
          text = removeTimestamps(text);
        }}
      >
        Remove timestamps
      </Button>
    </div>

    <Button class="!w-full whitespace-nowrap" disabled={!text} on:click={handleSubmit}>Submit</Button>
  </div>
</div>

<style lang="scss">
  textarea {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;

    border: 1px solid theme("colors.foreground");
    background-color: theme("colors.background");
    color: theme("colors.foreground");

    &:focus {
      outline: none !important;
    }
  }
</style>
