<script lang="ts">
  import SpeedReader from "./lib/SpeedReader.svelte";

  let text: string | undefined;
  let isStartReader = false;
</script>

<main>
  {#if text !== undefined && isStartReader}
    <SpeedReader {text} />
  {:else}
    <div id="root">
      <h1>Speed Reader</h1>
      <textarea bind:value={text} rows="10" />
      <button type="submit" on:click={() => (isStartReader = true)}>Submit</button>
    </div>
  {/if}
</main>

<style>
  textarea {
    width: 100%;
    padding: 1rem;
  }

  button {
    width: fit-content;
    padding: 0.5rem 1rem;
  }

  #root {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 2rem;
  }
</style>
