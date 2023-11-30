<script lang="ts">
  export let value: number;
</script>

<div class="wpm-input">
  <input type="number" id="wpm-input" bind:value data-ignore-key-event />
  <label for="wpm-input" class="font-medium">WPM</label>
</div>

<style lang="scss">
  .wpm-input {
    width: fit-content;
    border-radius: 0.25rem;

    &:focus-within {
      outline: 2px solid theme("colors.foreground");
      outline-offset: 2px;
    }
  }

  input {
    background-color: theme("colors.background");
    outline: none !important;
    text-align: right;
    width: 48px;

    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
  }
</style>
