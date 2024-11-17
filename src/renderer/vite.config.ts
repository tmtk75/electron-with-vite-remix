import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      // SPA mode
      ssr: false,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        dir: "out/renderer",
      },
    },
    minify: false,
    emptyOutDir: false,
  },
});
