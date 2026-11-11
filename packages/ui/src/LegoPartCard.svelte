<script lang="ts">
  import type { LegoPart } from "@rego/domain";
  import CheckIcon from "./icons/CheckIcon.svelte";
  import MinusIcon from "./icons/MinusIcon.svelte";
  import PlusIcon from "./icons/PlusIcon.svelte";

  interface Props {
    part: LegoPart;
    quantityFound?: number;
    onincrement?: () => void;
    ondecrement?: () => void;
  }

  let { part, quantityFound = 0, onincrement, ondecrement }: Props = $props();

  let isComplete = $derived(quantityFound >= part.quantity && part.quantity > 0);
  let progressPercent = $derived(
    part.quantity > 0
      ? Math.min(100, Math.round((quantityFound / part.quantity) * 100))
      : 0
  );
</script>

<div
  class={`relative flex flex-col justify-between rounded-2xl border transition-all duration-200 overflow-hidden select-none ${
    isComplete
      ? "bg-emerald-500/10 border-emerald-500/50 dark:border-emerald-500/40 shadow-sm"
      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700"
  }`}
>
  <!-- Top Progress Bar Stripe -->
  <div class="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
    <div
      class={`h-full transition-all duration-300 ${isComplete ? "bg-emerald-500" : "bg-blue-600 dark:bg-blue-500"}`}
      style={`width: ${progressPercent}%;`}
    ></div>
  </div>

  <div class="p-4 flex flex-col flex-1">
    <!-- Image Box with high-contrast background to ensure black/dark pieces are clearly visible -->
    <div
      class="relative w-full aspect-square mb-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 p-3 flex items-center justify-center overflow-hidden"
    >
      {#if isComplete}
        <div
          class="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center gap-1 shadow-md"
        >
          <CheckIcon class="size-3" />
          <span>DONE</span>
        </div>
      {/if}

      {#if part.imgUrl}
        <img
          src={part.imgUrl}
          alt={part.name}
          loading="lazy"
          class="h-full w-full object-contain drop-shadow-sm"
        />
      {:else}
        <div class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          No Preview
        </div>
      {/if}
    </div>

    <!-- Metadata: Color Badge & Part Title -->
    <div class="mb-4 flex-1">
      <div class="flex items-center gap-1.5 mb-1.5 flex-wrap">
        <span
          class="inline-block px-2.5 py-0.5 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
        >
          {part.color}
        </span>
      </div>
      <h4
        class="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2"
      >
        {part.name}
      </h4>
    </div>

    <!-- Stepper / Counter Controls (Optimized for Touch, Desktop & Wry/WebKit) -->
    <div
      class="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3"
    >
      <!-- Decrement Button -->
      <button
        type="button"
        onclick={ondecrement}
        disabled={quantityFound <= 0}
        aria-label={`Decrease ${part.name}`}
        class="w-12 h-11 min-w-[48px] min-h-[44px] shrink-0 rounded-xl font-bold flex items-center justify-center appearance-none bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-red-500 cursor-pointer transition-colors"
      >
        <MinusIcon class="size-5" />
      </button>

      <!-- Quantity Display -->
      <div class="flex-1 text-center min-w-0">
        <div
          class="text-lg font-black text-zinc-900 dark:text-zinc-100 tabular-nums tracking-tight"
        >
          {quantityFound}
          <span class="text-sm font-semibold text-zinc-400 dark:text-zinc-500">
            / {part.quantity}
          </span>
        </div>
      </div>

      <!-- Increment Button -->
      <button
        type="button"
        onclick={onincrement}
        disabled={quantityFound >= part.quantity}
        aria-label={`Increase ${part.name}`}
        class={`w-14 h-11 min-w-[56px] min-h-[44px] shrink-0 rounded-xl font-black flex items-center justify-center appearance-none text-white shadow-sm disabled:opacity-25 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-blue-500 cursor-pointer transition-all ${
          isComplete
            ? "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 border border-emerald-500"
            : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 border border-blue-500"
        }`}
      >
        {#if isComplete}
          <CheckIcon class="size-5" />
        {:else}
          <PlusIcon class="size-5" />
        {/if}
      </button>
    </div>
  </div>
</div>
