import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const rawBase = process.env.BASE_PATH;
const base = rawBase
  ? /** @type {`/${string}`} */ (rawBase.startsWith("/") ? rawBase : `/${rawBase}`)
  : "";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html",
      precompress: false,
      strict: false,
    }),
    paths: {
      base,
    },
  },
};

export default config;
