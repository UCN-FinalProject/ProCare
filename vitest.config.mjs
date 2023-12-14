/** @type {import('vitest').ProjectConfig} */
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/server/service*"],
      exclude: ["src/server/service/validation*"],
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
