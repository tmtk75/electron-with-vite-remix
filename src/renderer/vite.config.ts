import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        dir: "out/renderer",
      },
    },
    minify: false,
  },
});
