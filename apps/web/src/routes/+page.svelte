<script lang="ts">
  import {
    calculateProgress,
    clearAuthFromStorage,
    decrementPartFound,
    getSetParts,
    getUserSets,
    incrementPartFound,
    loadAuthFromStorage,
    loadPartsFoundFromStorage,
    saveAuthToStorage,
    savePartsFoundToStorage,
    type LegoPart,
    type LegoSet,
    type PartsFoundMap,
    type RebrickableAuth,
  } from "@rego/domain";
  import { AuthForm, FilterToggle, Header, LegoPartCard, LegoSetCard } from "@rego/ui";

  let auth = $state<RebrickableAuth | null>(null);
  let isCheckingAuth = $state(true);
  let isLoading = $state(false);
  let errorMessage = $state<string | null>(null);

  let sets = $state<LegoSet[]>([]);
  let activeSet = $state<LegoSet | null>(null);
  let parts = $state<LegoPart[]>([]);
  let partsFound = $state<PartsFoundMap>({});

  let setFilterQuery = $state("");
  let hideCompleted = $state(false);

  // Derived progress
  let progress = $derived(calculateProgress(parts, partsFound));

  // Filtered sets list
  let filteredSets = $derived.by(() => {
    if (!setFilterQuery.trim()) return sets;
    const q = setFilterQuery.toLowerCase();
    return sets.filter(
      (s) => s.name.toLowerCase().includes(q) || s.num.toLowerCase().includes(q)
    );
  });

  // Filtered parts list
  let visibleParts = $derived.by(() => {
    if (!hideCompleted) return parts;
    return parts.filter((part) => (partsFound[part.id] ?? 0) < part.quantity);
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
    activeSet = null;
    parts = [];
    partsFound = {};
  }

  async function handleSelectSet(set: LegoSet) {
    if (!auth) return;
    activeSet = set;
    parts = [];
    partsFound = loadPartsFoundFromStorage(localStorage, set.num);
    isLoading = true;
    errorMessage = null;

    const result = await getSetParts(auth.apiKey, set.num);
    isLoading = false;

    if (result.isRight()) {
      parts = result.value;
    } else {
      errorMessage = result.error;
    }
  }

  function handleBackToSets() {
    activeSet = null;
    parts = [];
    partsFound = {};
  }

  function handleIncrementPart(part: LegoPart) {
    if (!activeSet) return;
    const current = partsFound[part.id] ?? 0;
    const next = incrementPartFound(current, part.quantity);
    partsFound = { ...partsFound, [part.id]: next };
    savePartsFoundToStorage(localStorage, activeSet.num, partsFound);
  }

  function handleDecrementPart(part: LegoPart) {
    if (!activeSet) return;
    const current = partsFound[part.id] ?? 0;
    const next = decrementPartFound(current);
    partsFound = { ...partsFound, [part.id]: next };
    savePartsFoundToStorage(localStorage, activeSet.num, partsFound);
  }
</script>

<Header
  title="ReGo"
  subtitle={activeSet
    ? `${activeSet.name} (#${activeSet.num})`
    : auth
      ? "My Lego Sets"
      : undefined}
  showBack={Boolean(activeSet)}
  onback={handleBackToSets}
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
  {:else if activeSet}
    <!-- Set Inventory Inspection View -->
    <div class="space-y-6">
      <!-- Set Banner & Progress Card -->
      <div
        class="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 sm:p-6 shadow-sm"
      >
        <div class="flex flex-col sm:flex-row items-center gap-6">
          {#if activeSet.imgUrl}
            <div
              class="size-24 sm:size-28 rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-2 flex items-center justify-center shrink-0"
            >
              <img
                src={activeSet.imgUrl}
                alt={activeSet.name}
                class="h-full w-full object-contain"
              />
            </div>
          {/if}

          <div class="flex-1 w-full text-center sm:text-left">
            <span
              class="inline-block px-2.5 py-0.5 text-xs font-black rounded-lg bg-amber-400 text-zinc-950 uppercase tracking-wider mb-2"
            >
              #{activeSet.num}
            </span>
            <h2
              class="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-tight mb-2"
            >
              {activeSet.name}
            </h2>

            <!-- Progress Bar -->
            <div class="space-y-1.5 mt-3">
              <div
                class="flex items-center justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400"
              >
                <span
                  >Parts Collected: {progress.totalFound} / {progress.totalRequired}</span
                >
                <span class="font-black text-zinc-900 dark:text-zinc-100"
                  >{progress.percent}%</span
                >
              </div>
              <div
                class="w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
              >
                <div
                  class="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-300"
                  style={`width: ${progress.percent}%;`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {#if progress.isComplete}
          <div
            class="mt-4 p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-2"
          >
            <span>🎉 All parts accounted for! Set is ready to be boxed!</span>
          </div>
        {/if}
      </div>

      <!-- Controls & Filter Toolbar -->
      <div class="flex items-center justify-between gap-4">
        <div class="text-xs font-bold text-zinc-500 dark:text-zinc-400">
          Showing {visibleParts.length} of {parts.length} unique parts
        </div>
        <FilterToggle
          {hideCompleted}
          completedCount={progress.completedPartsCount}
          ontoggle={() => (hideCompleted = !hideCompleted)}
        />
      </div>

      {#if isLoading}
        <div class="py-20 flex flex-col items-center justify-center gap-3">
          <div
            class="size-8 rounded-full border-3 border-amber-400 border-t-transparent animate-spin"
          ></div>
          <p class="text-xs font-semibold text-zinc-500">Loading set inventory...</p>
        </div>
      {:else if errorMessage}
        <div
          class="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm"
        >
          ⚠️ {errorMessage}
        </div>
      {:else if visibleParts.length === 0}
        <div
          class="py-16 text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400"
        >
          {#if hideCompleted && parts.length > 0}
            All parts are completed! Disable "Hide Completed" to view all parts.
          {:else}
            No parts found in this set.
          {/if}
        </div>
      {:else}
        <!-- Parts Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {#each visibleParts as part (part.id)}
            <LegoPartCard
              {part}
              quantityFound={partsFound[part.id] ?? 0}
              onincrement={() => handleIncrementPart(part)}
              ondecrement={() => handleDecrementPart(part)}
            />
          {/each}
        </div>
      {/if}
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
