<script lang="ts">
  import { MAX_WPM } from "../../stores/time.store";

  export let value: number;
</script>

<div class="wpm-input">
  <input data-ignore-key-event type="number" id="wpm-input" bind:value max={MAX_WPM} step="1" />
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

    &[type="number"]::-webkit-outer-spin-button,
    &[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type="number"] {
      -moz-appearance: textfield;
    }
  }
</style>
