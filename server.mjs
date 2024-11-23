//
// https://quramy.medium.com/remix-with-express-と-dev-server-301afc468f9b
//
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import remix from "@remix-run/express";

// expose electron
import electron from "electron";
global.electron = electron;

const __dirname = dirname(fileURLToPath(import.meta.url));

const mode = process.env.NODE_ENV;
if (mode === "production") {
  const port = 3000;
  const handleClientAssets = express.static(
    resolve(__dirname, "./out/renderer/client")
  );
  const app = express();
  app.all(
    "*",
    handleClientAssets,
    remix.createRequestHandler({
      build: await import("./out/renderer/server/index.js"),
    })
  );
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
} else {
  const vite = await import("vite");
  const viteServer = await vite.createServer({
    root: "./src/renderer",
  });
  const listen = await viteServer.listen();
  viteServer.printUrls();
}
