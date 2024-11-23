import { resolve } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [nodePolyfills()],
  build: {
    lib: {
      entry: resolve("src/main/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "vite",
        "electron",
        "node:fs", // without this, fs becomes null when imported. `import fs from "node:path"`
        "electron-serve",
        "electron-store",
        "@remix-run/node",
        // "mime", // NOTE: don't enable. not working if it's external.
      ],
      output: {
        dir: "out",
        entryFileNames: "main/[name].mjs",
        format: "esm",
      },
    },
    minify: false,
    emptyOutDir: false,
  },
});
