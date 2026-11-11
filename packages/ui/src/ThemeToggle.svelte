<script lang="ts">
  import SunIcon from "./icons/SunIcon.svelte";
  import MoonIcon from "./icons/MoonIcon.svelte";

  let isDark = $state(false);

  $effect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const active = stored ? stored === "dark" : prefersDark;
    isDark = active;
    document.documentElement.classList.toggle("dark", active);
  });

  function toggleTheme() {
    isDark = !isDark;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }
</script>

<button
  type="button"
  onclick={toggleTheme}
  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
  class="relative inline-flex items-center justify-center p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-amber-500 transition-colors cursor-pointer"
>
  {#if isDark}
    <SunIcon class="size-5 text-amber-400" />
  {:else}
    <MoonIcon class="size-5 text-zinc-700" />
  {/if}
</button>
