import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,

    environment: "node",
    include: ["src/**/*.{test,spec,property.test}.ts"],
    // Optional: give property tests more time
    // testTimeout: 15_000,
    setupFiles: ["src/test/setup/test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/index.ts",
        "src/server.ts",
        "src/**/*.test.ts",
        "src/**/*.property.test.ts",
      ],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/plugins": path.resolve(__dirname, "./src/plugins"),
    },
  },
});
