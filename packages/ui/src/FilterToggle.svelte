<script lang="ts">
  import FilterIcon from "./icons/FilterIcon.svelte";

  interface Props {
    hideCompleted?: boolean;
    completedCount?: number;
    ontoggle?: () => void;
  }

  let { hideCompleted = false, completedCount = 0, ontoggle }: Props = $props();
</script>

<button
  type="button"
  onclick={ontoggle}
  aria-pressed={hideCompleted}
  class={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer ${
    hideCompleted
      ? "bg-amber-400 text-zinc-950 shadow-sm"
      : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
  }`}
>
  <FilterIcon class="size-3.5" />
  <span>{hideCompleted ? "Showing Remaining Only" : "Hide Completed"}</span>
  {#if completedCount > 0}
    <span
      class="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-black/10 dark:bg-white/10"
    >
      {completedCount}
    </span>
  {/if}
</button>
