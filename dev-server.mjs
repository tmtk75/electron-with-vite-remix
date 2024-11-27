//
// https://quramy.medium.com/remix-with-express-と-dev-server-301afc468f9b
//
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import remix from "@remix-run/express";
import { app } from "electron";
import electron from "electron";
import { createServer } from "vite";

if (process.env.NODE_ENV !== "production") {
  // expose electron
  global.__electron__ = electron;

  const viteServer = await createServer({
    // configFile: "./src/renderer/vite.config.ts",
    root: "./src/renderer",
  });

  global.app = app;

  const listen = await viteServer.listen();
  viteServer.printUrls();
  console.log("version:", app.getVersion(), listen.config.server.port);
} else {
  // const __dirname = dirname(fileURLToPath(import.meta.url));
  const __dirname =
    "./dist/mac-arm64/electron-with-vite-remix.app/Contents/Resources/app";
  const publicAssets = resolve(__dirname, "./out/renderer/client");
  // const serverIndex = resolve("./out/renderer/server/index.js"); // works
  const serverIndex = resolve(__dirname, "./out/renderer/server/index.js"); // fails.

  console.debug("pwd:", process.cwd());
  console.debug({ __dirname });
  console.debug({ publicAssets, serverIndex });

  const port = 3000;
  const handleClientAssets = express.static(publicAssets);
  const app = express();
  app.all(
    "*",
    handleClientAssets,
    remix.createRequestHandler({
      build: await import(serverIndex),
    })
  );
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
}