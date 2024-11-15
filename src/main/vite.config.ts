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
      entry: resolve("src/main/index.ts"),
      // name: camelCase(name, { pascalCase: true }),
      formats: ["es"],
    },
    rollupOptions: {
      onwarn: (warning, defaultHandler) => {
        if (IGNORE_ROLLUP_WARNING_CODE.includes(warning?.code)) {
          // return;
        }
        defaultHandler(warning);
      },
      external: [
        "electron",
        "node:fs", // without this, fs becomes null when imported. `import fs from "node:path"`
      ],
      output: {
        dir: "out",
        entryFileNames: "main/[name].mjs",
      },
    },
    minify: false,
    emptyOutDir: false,
  },
  esbuild: {
    platform: "node",
  },
});
