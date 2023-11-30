<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Colors } from "../../configs/style.config";

  interface $$Props extends HTMLButtonAttributes {
    colorScheme?: Colors;
  }

  export let colorScheme: $$Props["colorScheme"] = undefined;
</script>

<button type="button" data-color-scheme={colorScheme} on:click {...$$restProps}>
  <slot />
</button>

<style lang="scss">
  @use "sass:map";

  @import "../../styles/variables.scss";

  button {
    width: fit-content;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 0.25rem;
    font-weight: 500;

    border: 1px solid theme("colors.foreground");
    background-color: theme("colors.foreground");
    color: theme("colors.background");

    &:hover {
      background-color: theme("colors.background");
      color: theme("colors.foreground");
    }

    &:active {
      transform: translateY(1px);
    }

    &:focus-visible {
      outline: 2px solid theme("colors.foreground");
      outline-offset: 2px;
    }

    @each $colorScheme, $color in $colors {
      &[data-color-scheme="#{$colorScheme}"] {
        border-color: $color;
        background-color: $color;

        &:hover {
          background-color: theme("colors.background");
          color: $color;
        }

        &:focus-visible {
          outline-color: $color;
        }
      }
    }

    &:disabled {
      transform: none !important;
      opacity: 0.6;
      pointer-events: none;
      cursor: default !important;
    }
  }
</style>
