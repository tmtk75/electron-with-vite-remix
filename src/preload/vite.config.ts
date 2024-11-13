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
        entryFileNames: "preload/[name].cjs",
      },
    },
    minify: false,
    emptyOutDir: false,
  },
  esbuild: {
    platform: "node",
  },
});
