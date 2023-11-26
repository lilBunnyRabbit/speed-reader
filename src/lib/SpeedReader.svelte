<script lang="ts">
  export let text: string;

  $: words = text.split(/\s+/g);

  let index = 0;
  let wpm = 300;
  let isStopped = true;

  let interval: number | undefined;
  const stopInterval = () => {
    isStopped = true;

    if (interval !== undefined) {
      clearInterval(interval);
      interval = undefined;
    }
  };

  const startInterval = () => {
    stopInterval();

    if (index >= words.length - 1) {
      return;
    }

    isStopped = false;

    interval = setInterval(() => {
      if (index + 1 >= words.length) {
        return stopInterval();
      }
      index++;
    }, 60000 / wpm);
  };

  $: wpm, startInterval();
</script>

<div id="speed-reader">
  <div class="word-box">
    <h1>{words[index] ?? "Start reader"}</h1>
  </div>

  <div class="tool-box">
    <button
      disabled={index >= words.length - 1}
      on:click={() => {
        isStopped ? startInterval() : stopInterval();
      }}
    >
      {isStopped ? "Start" : "Stop"}
    </button>

    <div class="input-grid">
      <input
        type="range"
        name="progress"
        bind:value={index}
        min={0}
        max={words.length - 1}
        step="1"
        on:input={stopInterval}
        on:change={startInterval}
      />
      <div>{index + 1} / {words.length}</div>

      <input type="range" name="wpm" bind:value={wpm} min={100} max={1000} step="10" />
      <div>
        <input type="number" bind:value={wpm} /> WPM
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  #speed-reader {
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr min-content;
    row-gap: 2rem;
  }

  .input-grid {
    display: grid;
    grid-template-columns: 1fr min-content;
    white-space: nowrap;
    column-gap: 1rem;
    row-gap: 0.5rem;
    width: 100%;
    place-items: center;

    & > *:nth-child(even) {
      width: 100px;
      text-align: start;
    }
  }

  .word-box {
    padding-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tool-box {
    padding-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  button {
    width: fit-content;
    padding: 0.5rem 1rem;
  }

  input {
    width: 100%;
  }
</style>
