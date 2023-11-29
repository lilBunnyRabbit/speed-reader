<script lang="ts">
  import SpeedReader from "./components/SpeedReader.svelte";
  import { words } from "./stores/time.store";

  let text: string | undefined;
</script>

{#if $words.length > 0}
  <SpeedReader />
{:else}
  <main id="landing-page">
    <h1>Speed Reader</h1>
    <textarea bind:value={text} rows="10" />
    <button
      type="submit"
      disabled={!text}
      on:click={() => {
        if (!text) return;

        $words = text.trim().split(/\s+/g);
      }}>Submit</button
    >
  </main>
{/if}

<style lang="scss">
  main#landing-page {
    flex: 1;
    // border: 1px solid white;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    h1 {
      font-size: 48px;
      text-align: center;
    }

    textarea {
      width: 100%;
    }

    button {
      width: fit-content;
      padding: 0.5rem 1rem;
      margin-top: 1rem;
    }
  }
</style>
