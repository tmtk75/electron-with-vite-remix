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
        ...[
          "electron-log",
          // electron-log uses fs internally
          "fs",
          "util",
        ],
        "node:fs", // without this, fs becomes null when imported. `import fs from "node:path"`
        "electron-store",
        "@react-router/node",
        // "mime", // NOTE: don't enable. not working if it's external.
        "electron-updater",
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
