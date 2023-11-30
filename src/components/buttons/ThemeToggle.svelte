<script lang="ts">
  import { theme } from "../../stores/theme.store";
  import MoonIcon from "../icons/MoonIcon.svelte";
  import SunIcon from "../icons/SunIcon.svelte";
  import IconButton from "./IconButton.svelte";

  $: selected = $theme === "dark" ? MoonIcon : SunIcon;
</script>

<IconButton on:click={() => theme.toggle()} class={$$props.class} variant="transparent">
  <svelte:component this={selected} />
</IconButton>
