<script lang="ts">
  import ReaderInput from "./components/ReaderInput.svelte";
  import ThemeToggle from "./components/buttons/ThemeToggle.svelte";
  import SpeedReader from "./pages/SpeedReader.svelte";
  import { words } from "./stores/time.store";
</script>

{#if $words.length > 0}
  <SpeedReader />
{:else}
  <main id="landing-page">
    <h1>Speed Reader</h1>
    <ReaderInput />
  </main>
{/if}

<ThemeToggle class="absolute top-2 right-2" />

<style lang="scss">
  main#landing-page {
    position: relative;
    flex: 1;
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
  }
</style>
