<script lang="ts">
  import type { LegoSet } from "@rego/domain";

  interface Props {
    set: LegoSet;
    onselect?: (set: LegoSet) => void;
  }

  let { set, onselect }: Props = $props();
</script>

<div
  class="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-4 shadow-sm hover:shadow-md hover:border-amber-400/80 dark:hover:border-amber-500/80 transition-all overflow-hidden"
>
  <!-- Decorative LEGO Studs on top right corner -->
  <div
    class="absolute top-3 right-3 flex gap-1 opacity-20 group-hover:opacity-60 transition-opacity"
  >
    <div class="size-2 rounded-full bg-zinc-400 dark:bg-zinc-600 shadow-inner"></div>
    <div class="size-2 rounded-full bg-zinc-400 dark:bg-zinc-600 shadow-inner"></div>
  </div>

  <div>
    <!-- Set Image Container -->
    <div
      class="relative w-full aspect-4/3 mb-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 overflow-hidden flex items-center justify-center p-3"
    >
      {#if set.imgUrl}
        <img
          src={set.imgUrl}
          alt={set.name}
          loading="lazy"
          class="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      {:else}
        <div class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          No Preview
        </div>
      {/if}
    </div>

    <!-- Set Number Badge -->
    <span
      class="inline-block px-2 py-0.5 text-xs font-bold rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 mb-1.5 tracking-wide"
    >
      #{set.num}
    </span>

    <!-- Set Name -->
    <h3
      class="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug"
    >
      {set.name}
    </h3>
  </div>

  <!-- Action Button -->
  <div class="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
    <button
      type="button"
      onclick={() => onselect?.(set)}
      class="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-zinc-950 shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-amber-600 cursor-pointer"
    >
      <span>Open Inventory</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="size-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
</div>
