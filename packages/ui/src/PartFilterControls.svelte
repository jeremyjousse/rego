<script lang="ts">
  import FilterToggle from "./FilterToggle.svelte";
  import CloseIcon from "./icons/CloseIcon.svelte";

  interface Props {
    hideCompleted?: boolean;
    completedCount?: number;
    color?: string;
    colors?: string[];
    category?: string;
    categories?: string[];
    totalPartsCount?: number;
    visiblePartsCount?: number;
    ontogglehide?: () => void;
    oncolorchange?: (color: string) => void;
    oncategorychange?: (category: string) => void;
    onreset?: () => void;
  }

  let {
    hideCompleted = false,
    completedCount = 0,
    color = "",
    colors = [],
    category = "",
    categories = [],
    totalPartsCount = 0,
    visiblePartsCount = 0,
    ontogglehide,
    oncolorchange,
    oncategorychange,
    onreset,
  }: Props = $props();

  let hasActiveFilters = $derived(
    hideCompleted || Boolean(color.trim()) || Boolean(category.trim())
  );
</script>

<div
  class="flex flex-col gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
>
  <div
    class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold text-zinc-500 dark:text-zinc-400"
  >
    <div>
      Showing <span class="text-zinc-900 dark:text-zinc-100 font-black"
        >{visiblePartsCount}</span
      >
      of
      <span class="text-zinc-900 dark:text-zinc-100 font-black">{totalPartsCount}</span> unique
      parts
    </div>

    {#if hasActiveFilters}
      <button
        type="button"
        onclick={onreset}
        aria-label="Reset all filters"
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer w-fit"
      >
        <CloseIcon class="size-3.5" />
        <span>Reset Filters</span>
      </button>
    {/if}
  </div>

  <div class="flex flex-wrap items-center gap-2.5">
    <!-- Hide Completed Toggle -->
    <FilterToggle {hideCompleted} {completedCount} ontoggle={ontogglehide} />

    <!-- Color Filter Selector -->
    <div class="relative min-w-[140px] flex-1 sm:flex-initial">
      <select
        aria-label="Filter parts by color"
        value={color}
        onchange={(e) => oncolorchange?.((e.target as HTMLSelectElement).value)}
        class="w-full appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer"
      >
        <option value="">All Colors ({colors.length})</option>
        {#each colors as c (c)}
          <option value={c}>{c}</option>
        {/each}
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-zinc-400"
      >
        <svg class="size-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <!-- Category / Shape Filter Selector -->
    <div class="relative min-w-[140px] flex-1 sm:flex-initial">
      <select
        aria-label="Filter parts by category or shape"
        value={category}
        onchange={(e) => oncategorychange?.((e.target as HTMLSelectElement).value)}
        class="w-full appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer"
      >
        <option value="">All Categories ({categories.length})</option>
        {#each categories as cat (cat)}
          <option value={cat}>{cat}</option>
        {/each}
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-zinc-400"
      >
        <svg class="size-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
</div>
