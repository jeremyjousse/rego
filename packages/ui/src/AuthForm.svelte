<script lang="ts">
  import LegoBrickIcon from "./icons/LegoBrickIcon.svelte";

  interface Props {
    onsubmit?: (auth: { apiKey: string; userToken: string }) => void;
    isLoading?: boolean;
    errorMessage?: string | null;
  }

  let { onsubmit, isLoading = false, errorMessage = null }: Props = $props();

  let apiKey = $state("");
  let userToken = $state("");

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!apiKey.trim() || !userToken.trim()) return;
    onsubmit?.({ apiKey: apiKey.trim(), userToken: userToken.trim() });
  }
</script>

<div
  class="w-full max-w-md mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 shadow-xl"
>
  <!-- Brand Heading -->
  <div class="text-center mb-6">
    <div class="inline-flex p-3 rounded-2xl bg-red-600 text-white shadow-md mb-3">
      <LegoBrickIcon class="size-8" />
    </div>
    <h2 class="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
      Connect Rebrickable
    </h2>
    <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
      Track parts and repack your LEGO sets with precision
    </p>
  </div>

  <!-- Rebrickable Guides / Links -->
  <div
    class="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-2"
  >
    <p class="font-bold">How to retrieve your credentials:</p>
    <ol class="list-decimal list-inside space-y-1">
      <li>
        Create an account on <a
          href="https://rebrickable.com/"
          target="_blank"
          rel="noreferrer"
          class="underline font-bold hover:text-amber-700">rebrickable.com</a
        >
      </li>
      <li>
        Obtain your <a
          href="https://rebrickable.com/api/"
          target="_blank"
          rel="noreferrer"
          class="underline font-bold hover:text-amber-700">API Key</a
        >
      </li>
      <li>
        Generate a <a
          href="https://rebrickable.com/api/v3/swagger/?key=#!/users/users_token_create#users_users_token_create"
          target="_blank"
          rel="noreferrer"
          class="underline font-bold hover:text-amber-700">User Token</a
        >
      </li>
    </ol>
    <p
      class="text-[11px] text-zinc-500 dark:text-zinc-400 pt-1 border-t border-amber-200/60 dark:border-amber-900/40"
    >
      🔒 Credentials stay on your device in local storage. No custom servers used.
    </p>
  </div>

  {#if errorMessage}
    <div
      class="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs font-semibold"
    >
      ⚠️ {errorMessage}
    </div>
  {/if}

  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label
        for="apiKey"
        class="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
      >
        API Key
      </label>
      <input
        id="apiKey"
        name="apiKey"
        type="password"
        bind:value={apiKey}
        required
        placeholder="Enter your Rebrickable API key"
        class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-amber-500 text-sm font-mono transition-colors"
      />
    </div>

    <div>
      <label
        for="userToken"
        class="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
      >
        User Token
      </label>
      <input
        id="userToken"
        name="userToken"
        type="password"
        bind:value={userToken}
        required
        placeholder="Enter your User Token"
        class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-amber-500 text-sm font-mono transition-colors"
      />
    </div>

    <button
      type="submit"
      disabled={isLoading || !apiKey.trim() || !userToken.trim()}
      class="w-full py-3 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-40 text-white shadow-md transition-all focus-visible:outline-2 focus-visible:outline-red-500 cursor-pointer flex items-center justify-center gap-2"
    >
      {#if isLoading}
        <div
          class="size-4 rounded-full border-2 border-white border-t-transparent animate-spin"
        ></div>
        <span>Connecting...</span>
      {:else}
        <span>Sign In & Load Sets</span>
      {/if}
    </button>
  </form>
</div>
