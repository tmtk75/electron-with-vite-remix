import { resolve } from "path";
import { defineConfig } from "vite";
// import { name } from "../../package.json";
// import camelCase from "camelcase";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const IGNORE_ROLLUP_WARNING_CODE = [
  "MISSING_GLOBAL_NAME",
  "MISSING_NODE_BUILTINS",
];

export default defineConfig({
  plugins: [nodePolyfills()],
  build: {
    lib: {
      entry: resolve("src/preload/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        dir: "out",
        entryFileNames: "preload/[name].mjs",
      },
    },
    minify: false,
    emptyOutDir: false,
  },
  esbuild: {
    platform: "node",
  },
});
