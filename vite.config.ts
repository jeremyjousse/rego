import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "./build",
  },
  test: {
    coverage: {
      all: true,
      exclude: ["*.cjs", "*.config.js"],
      provider: "istanbul",
      reporter: ["html", "json", "json-summary", "lcov", "text"],
      reportsDirectory: "./coverage",
    },
    include: ["src/**/*.{test,spec}.{js,ts,tsx}"],
    environment: "jsdom",
    globals: true,
    setupFiles: [
      "./vitest/config/cleanupDom.ts",
      "./vitest/config/registerMatchers.ts",
    ],
    testTimeout: 10000,
    restoreMocks: true,
  },
});
