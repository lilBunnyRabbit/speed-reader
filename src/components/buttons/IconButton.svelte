<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Colors } from "../../configs/style.config";

  interface $$Props extends HTMLButtonAttributes {
    colorScheme?: Colors;
    variant?: "normal" | "ghost" | "transparent";
  }

  export let colorScheme: $$Props["colorScheme"] = undefined;
  export let variant: $$Props["variant"] = "normal";
</script>

<button type="button" data-color-scheme={colorScheme} data-variant={variant} on:click {...$$restProps}>
  <slot />
</button>

<style lang="scss">
  @use "sass:map";

  @import "../../styles/variables.scss";

  button {
    width: fit-content;
    height: fit-content;
    padding: 0.25rem;
    aspect-ratio: 1 / 1;
    cursor: pointer;
    border-radius: 0.25rem;

    &:active {
      transform: translateY(1px);
    }

    &[data-variant="normal"] {
      border: 1px solid theme("colors.foreground");
      background-color: theme("colors.foreground");
      color: theme("colors.background");

      &:hover {
        background-color: theme("colors.background");
        color: theme("colors.foreground");
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
    }

    &[data-variant="ghost"] {
      color: theme("colors.foreground");

      &:hover {
        background-color: theme("colors.foreground");
        color: theme("colors.background");
      }

      &:focus-visible {
        outline: 2px solid theme("colors.foreground");
        outline-offset: 2px;
      }

      @each $colorScheme, $color in $colors {
        &[data-color-scheme="#{$colorScheme}"] {
          color: $color;

          &:hover {
            background-color: $color;
            color: theme("colors.background");
          }

          &:focus-visible {
            outline-color: $color !important;
          }
        }
      }
    }

    &[data-variant="transparent"] {
      color: theme("colors.foreground");

      padding: 0px;

      &:focus-visible {
        outline: 2px solid theme("colors.foreground");
        outline-offset: 2px;
      }

      @each $colorScheme, $color in $colors {
        &[data-color-scheme="#{$colorScheme}"] {
          color: $color;

          &:focus-visible {
            outline-color: $color !important;
          }
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
