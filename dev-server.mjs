// simple vite-dev-server to develop renderer process.
// @ts-check
import electron, { app } from "electron";
import { createServer } from "vite";

// expose electron
global.__electron__ = electron;
const viteServer = await createServer({ root: "./src/renderer" });
await viteServer.listen();
viteServer.printUrls();
console.debug("version:", app.getVersion());
