<script lang="ts">
  import { goto, replaceState } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import {
    clearAuthFromStorage,
    filterLegoSets,
    getUserSets,
    loadAuthFromStorage,
    saveAuthToStorage,
    type LegoSet,
    type RebrickableAuth,
  } from "@rego/domain";
  import { AuthForm, Header, LegoSetCard } from "@rego/ui";

  let auth = $state<RebrickableAuth | null>(null);
  let isCheckingAuth = $state(true);
  let isLoading = $state(false);
  let errorMessage = $state<string | null>(null);

  let sets = $state<LegoSet[]>([]);

  // Restored from URL search query parameter (?q=...)
  let setFilterQuery = $state(page.url.searchParams.get("q") ?? "");

  // Filtered sets list
  let filteredSets = $derived(filterLegoSets(sets, setFilterQuery));

  // Persist set search query in URL search parameters (?q=...) using shallow replaceState
  $effect(() => {
    if (typeof window === "undefined") return;

    const currentQ = page.url.searchParams.get("q") ?? "";
    const trimmed = setFilterQuery.trim();

    if (currentQ !== trimmed) {
      const url = new URL(page.url);
      if (trimmed) {
        url.searchParams.set("q", trimmed);
      } else {
        url.searchParams.delete("q");
      }
      replaceState(url.pathname + url.search, page.state);
    }
  });

  // Load initial auth on mount
  $effect(() => {
    if (typeof window === "undefined") return;
    const stored = loadAuthFromStorage(localStorage);
    if (stored) {
      auth = stored;
      loadSets(stored);
    }
    isCheckingAuth = false;
  });

  async function loadSets(currentAuth: RebrickableAuth) {
    isLoading = true;
    errorMessage = null;
    const result = await getUserSets(currentAuth.apiKey, currentAuth.userToken);
    isLoading = false;

    if (result.isRight()) {
      sets = result.value;
    } else {
      errorMessage = result.error;
    }
  }

  async function handleAuthSubmit(credentials: { apiKey: string; userToken: string }) {
    isLoading = true;
    errorMessage = null;
    const result = await getUserSets(credentials.apiKey, credentials.userToken);
    isLoading = false;

    if (result.isRight()) {
      saveAuthToStorage(localStorage, credentials);
      auth = credentials;
      sets = result.value;
    } else {
      errorMessage = result.error;
    }
  }

  function handleLogout() {
    clearAuthFromStorage(localStorage);
    auth = null;
    sets = [];
  }

  function handleSelectSet(set: LegoSet) {
    goto(`${base}/sets/${encodeURIComponent(set.num)}`);
  }
</script>

<Header
  title="ReGo"
  subtitle={auth ? "My Lego Sets" : undefined}
  showBack={false}
  showLogout={Boolean(auth)}
  onlogout={handleLogout}
/>

<div class="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8">
  {#if isCheckingAuth}
    <div class="py-24 flex flex-col items-center justify-center gap-3">
      <div
        class="size-8 rounded-full border-3 border-amber-400 border-t-transparent animate-spin"
      ></div>
      <p class="text-xs font-semibold text-zinc-500">Checking credentials...</p>
    </div>
  {:else if !auth}
    <!-- Auth Gateway View -->
    <div class="py-8 sm:py-12">
      <AuthForm onsubmit={handleAuthSubmit} {isLoading} {errorMessage} />
    </div>
  {:else}
    <!-- Sets List View -->
    <div class="space-y-6">
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
      >
        <div>
          <h2
            class="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight"
          >
            Select a Set to Rebox
          </h2>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">
            {sets.length}
            {sets.length === 1 ? "set" : "sets"} found in your Rebrickable collection
          </p>
        </div>

        <!-- Search Filter -->
        <div class="w-full sm:w-64">
          <input
            type="search"
            placeholder="Search set name or #..."
            bind:value={setFilterQuery}
            class="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-amber-500"
          />
        </div>
      </div>

      {#if isLoading}
        <div class="py-20 flex flex-col items-center justify-center gap-3">
          <div
            class="size-8 rounded-full border-3 border-amber-400 border-t-transparent animate-spin"
          ></div>
          <p class="text-xs font-semibold text-zinc-500">Fetching your LEGO sets...</p>
        </div>
      {:else if errorMessage}
        <div
          class="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm"
        >
          ⚠️ {errorMessage}
        </div>
      {:else if filteredSets.length === 0}
        <div
          class="py-16 text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400"
        >
          No sets matched your search query.
        </div>
      {:else}
        <!-- Sets Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {#each filteredSets as set (set.num)}
            <LegoSetCard {set} onselect={handleSelectSet} />
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
