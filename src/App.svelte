<script lang="ts">
  import ReaderInput from "./components/ReaderInput.svelte";
  import IconButton from "./components/buttons/IconButton.svelte";
  import ThemeToggle from "./components/buttons/ThemeToggle.svelte";
  import HomeIcon from "./components/icons/HomeIcon.svelte";
  import SpeedReader from "./pages/SpeedReader.svelte";
  import { text } from "./stores/text.store";
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

<div class="absolute top-2 right-2">
  {#if $words.length > 0}
    <IconButton on:click={() => ($words = [])} variant="ghost">
      <HomeIcon />
    </IconButton>
  {/if}

  <ThemeToggle />
</div>

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
    max-width: 1280px;
    margin: 0px auto;

    h1 {
      font-size: 48px;
      text-align: center;
    }
  }
</style>
