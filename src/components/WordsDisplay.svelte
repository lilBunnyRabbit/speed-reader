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
  <div class="words-list">
    <h2>{lastN}</h2>
    <h1>
      {$words[$index]}
    </h1>
    <h2>{nextN}</h2>
  </div>
</div>

<style lang="scss">
  .words-display {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    // border: 1px solid red;
  }

  .words-list {
    display: grid;
    grid-template-columns: 1fr min-content 1fr;
    align-items: baseline;
    justify-content: center;
    gap: 1rem;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
  }

  h1 {
    font-size: 48px;
  }

  h2 {
    opacity: 0.3;

    &:first-child {
      justify-self: flex-end;
    }
    &:last-child {
      justify-self: flex-start;
    }

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
