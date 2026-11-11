<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
</script>

<div
  class="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
>
  <main class="flex-1 flex flex-col">
    {@render children?.()}
  </main>
</div>
