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
        "electron",
        "electron-log",
        "electron-store",
        "electron-updater",
        ...[
          // electron-log uses fs internally
          "fs",
          "util",
        ],
        "node:fs", // without this, fs becomes null when imported. `import fs from "node:path"`
        "node:url",
        "node:path",
        // "@react-router/node",
        // "mime", // NOTE: don't enable. not working if it's external.
        "vite", // NOTE: viteDevServer is used in the src/main/index.ts. Not ideal, but needed for now.
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
