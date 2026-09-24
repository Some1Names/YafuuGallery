import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for the plain-logic helpers in lib/ (no database, no R2, no
// browser). Run with `bun run test`.
export default defineConfig({
  resolve: {
    // same "@/…" import alias as tsconfig.json
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    include: ["lib/**/*.test.ts"],
    environment: "node",
    // lib/storage.ts reads these once at import to build/recognise public
    // URLs — a fixed fake value keeps the tests independent of .env.
    env: { R2_PUBLIC_URL: "https://cdn.example.test" },
  },
});
