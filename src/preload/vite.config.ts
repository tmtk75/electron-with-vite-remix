import { resolve } from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [nodePolyfills()],
  build: {
    lib: {
      entry: resolve("src/preload/index.ts"),
      formats: ["cjs"],
    },
    rollupOptions: {
      external: ["electron"],
      output: {
        dir: "out",

        // preload must be cjs format.
        // if mjs, it will be error:
        //   - Unable to load preload script.
        //   - SyntaxError: Cannot use import statement outside a module.
        entryFileNames: "preload/[name].cjs",
        format: "cjs",
      },
    },
    minify: false,
    emptyOutDir: false,
  },
  esbuild: {
    platform: "node",
  },
});
