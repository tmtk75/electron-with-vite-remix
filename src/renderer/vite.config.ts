import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      ssr: true,
      buildDirectory: "../../out/renderer",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    // tsconfigPaths(), // no need to use this plugin. I don't like path aliases so much.
  ],
  build: {
    minify: false,
    emptyOutDir: false,
    rollupOptions: {
      external: [
        "fs", // suppress vite warning: [plugin:vite:resolve] [plugin vite:resolve] Module "fs" has been externalized for browser compatibility
        "path", // suppress vite warning: [plugin:vite:resolve] [plugin vite:resolve] Module "path" has been externalized for browser compatibility
      ],
    },
  },
});
