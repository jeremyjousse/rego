<script lang="ts">
  import LegoBrickIcon from "./icons/LegoBrickIcon.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

  interface Props {
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    onback?: () => void;
    showLogout?: boolean;
    onlogout?: () => void;
  }

  let {
    title = "ReGo",
    subtitle,
    showBack = false,
    onback,
    showLogout = false,
    onlogout,
  }: Props = $props();
</script>

<header
  class="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-0 z-30"
>
  <!-- LEGO Top Accent Stripe -->
  <div class="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-400 to-blue-600"></div>

  <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      {#if showBack}
        <button
          type="button"
          onclick={onback}
          aria-label="Back to sets"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Sets
        </button>
      {/if}

      <div class="flex items-center gap-2">
        <div
          class="p-1.5 rounded-lg bg-red-600 text-white shadow-sm flex items-center justify-center"
        >
          <LegoBrickIcon class="size-5" />
        </div>
        <div>
          <h1
            class="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"
          >
            {title}
          </h1>
          {#if subtitle}
            <p
              class="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate max-w-xs sm:max-w-md"
            >
              {subtitle}
            </p>
          {/if}
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <ThemeToggle />

      {#if showLogout}
        <button
          type="button"
          onclick={onlogout}
          aria-label="Disconnect account"
          class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors focus-visible:outline-2 focus-visible:outline-red-500 cursor-pointer"
        >
          Disconnect
        </button>
      {/if}
    </div>
  </div>
</header>
