<script lang="ts">
  import { goto, replaceState } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import {
    calculateProgress,
    clearAuthFromStorage,
    decrementPartFound,
    filterLegoParts,
    getSet,
    getSetParts,
    incrementPartFound,
    loadAuthFromStorage,
    loadPartsFoundFromStorage,
    savePartsFoundToStorage,
    type LegoPart,
    type LegoSet,
    type PartsFoundMap,
    type RebrickableAuth,
  } from "@rego/domain";
  import { Header, LegoPartCard, PartFilterControls } from "@rego/ui";

  let setNum = $derived(page.params.setNum ?? "");

  let auth = $state<RebrickableAuth | null>(null);
  let isCheckingAuth = $state(true);
  let isLoading = $state(false);
  let errorMessage = $state<string | null>(null);

  let activeSet = $state<LegoSet | null>(null);
  let parts = $state<LegoPart[]>([]);
  let partsFound = $state<PartsFoundMap>({});

  // Filter state restored from URL search parameters
  let hideCompleted = $state(page.url.searchParams.get("hideCompleted") === "true");
  let selectedColor = $state(page.url.searchParams.get("color") ?? "");
  let selectedCategory = $state(page.url.searchParams.get("category") ?? "");

  // Derived progress
  let progress = $derived(calculateProgress(parts, partsFound));

  // Available unique colors and categories
  let availableColors = $derived.by(() =>
    Array.from(new Set(parts.map((p) => p.color))).sort((a, b) => a.localeCompare(b))
  );

  let availableCategories = $derived.by(() =>
    Array.from(new Set(parts.map((p) => p.category))).sort((a, b) => a.localeCompare(b))
  );

  // Filtered visible parts
  let visibleParts = $derived(
    filterLegoParts(parts, partsFound, {
      hideCompleted,
      color: selectedColor,
      category: selectedCategory,
    })
  );

  // Persist filter changes into URL search parameters using shallow replaceState
  $effect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(page.url);
    let changed = false;

    const urlHide = url.searchParams.get("hideCompleted") === "true";
    if (urlHide !== hideCompleted) {
      if (hideCompleted) {
        url.searchParams.set("hideCompleted", "true");
      } else {
        url.searchParams.delete("hideCompleted");
      }
      changed = true;
    }

    const urlColor = url.searchParams.get("color") ?? "";
    const cleanColor = selectedColor.trim();
    if (urlColor !== cleanColor) {
      if (cleanColor) {
        url.searchParams.set("color", cleanColor);
      } else {
        url.searchParams.delete("color");
      }
      changed = true;
    }

    const urlCategory = url.searchParams.get("category") ?? "";
    const cleanCategory = selectedCategory.trim();
    if (urlCategory !== cleanCategory) {
      if (cleanCategory) {
        url.searchParams.set("category", cleanCategory);
      } else {
        url.searchParams.delete("category");
      }
      changed = true;
    }

    if (changed) {
      replaceState(url.pathname + url.search, page.state);
    }
  });

  // Load auth & set inventory on mount
  $effect(() => {
    if (typeof window === "undefined") return;

    const storedAuth = loadAuthFromStorage(localStorage);
    if (storedAuth) {
      auth = storedAuth;
      if (setNum) {
        loadSetData(storedAuth, setNum);
      }
    }
    isCheckingAuth = false;
  });

  async function loadSetData(currentAuth: RebrickableAuth, currentSetNum: string) {
    isLoading = true;
    errorMessage = null;
    partsFound = loadPartsFoundFromStorage(localStorage, currentSetNum);

    const [setResult, partsResult] = await Promise.all([
      getSet(currentAuth.apiKey, currentSetNum),
      getSetParts(currentAuth.apiKey, currentSetNum),
    ]);

    isLoading = false;

    if (setResult.isRight()) {
      activeSet = setResult.value;
    } else {
      activeSet = {
        num: currentSetNum,
        name: `Set #${currentSetNum}`,
        imgUrl: "",
      };
    }

    if (partsResult.isRight()) {
      parts = partsResult.value;
    } else {
      errorMessage = partsResult.error;
    }
  }

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1 && document.referrer) {
      window.history.back();
    } else {
      goto(`${base}/`);
    }
  }

  function handleLogout() {
    clearAuthFromStorage(localStorage);
    auth = null;
    goto(`${base}/`);
  }

  function handleResetFilters() {
    hideCompleted = false;
    selectedColor = "";
    selectedCategory = "";
  }

  function handleIncrementPart(part: LegoPart) {
    if (!setNum) return;
    const current = partsFound[part.id] ?? 0;
    const next = incrementPartFound(current, part.quantity);
    partsFound = { ...partsFound, [part.id]: next };
    savePartsFoundToStorage(localStorage, setNum, partsFound);
  }

  function handleDecrementPart(part: LegoPart) {
    if (!setNum) return;
    const current = partsFound[part.id] ?? 0;
    const next = decrementPartFound(current);
    partsFound = { ...partsFound, [part.id]: next };
    savePartsFoundToStorage(localStorage, setNum, partsFound);
  }
</script>

<Header
  title="ReGo"
  subtitle={activeSet
    ? `${activeSet.name} (#${activeSet.num})`
    : setNum
      ? `Set #${setNum}`
      : undefined}
  showBack={true}
  onback={handleBack}
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
    <div
      class="py-16 text-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-8 space-y-4"
    >
      <h2 class="text-lg font-black text-zinc-900 dark:text-zinc-100">
        Authentication Required
      </h2>
      <p class="text-xs text-zinc-500 max-w-md mx-auto">
        Please sign in with your Rebrickable API key and User Token on the home page to
        inspect this set inventory.
      </p>
      <div>
        <button
          type="button"
          onclick={() => goto(`${base}/`)}
          class="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-zinc-950 hover:bg-amber-300 transition-colors cursor-pointer"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  {:else}
    <div class="space-y-6">
      <!-- Set Banner & Progress Card -->
      {#if activeSet}
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
      {/if}

      <!-- Advanced Filter Toolbar -->
      <PartFilterControls
        {hideCompleted}
        completedCount={progress.completedPartsCount}
        color={selectedColor}
        colors={availableColors}
        category={selectedCategory}
        categories={availableCategories}
        totalPartsCount={parts.length}
        visiblePartsCount={visibleParts.length}
        ontogglehide={() => (hideCompleted = !hideCompleted)}
        oncolorchange={(c) => (selectedColor = c)}
        oncategorychange={(cat) => (selectedCategory = cat)}
        onreset={handleResetFilters}
      />

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
          {#if parts.length === 0}
            No parts found in this set.
          {:else}
            No parts matched your active filter criteria.
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
  {/if}
</div>
