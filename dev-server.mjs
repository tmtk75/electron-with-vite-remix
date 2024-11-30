// @ts-check
//
// simple vite-dev-server to develop renderer process.
//
import electron, { app } from "electron";
import { createServer, loadEnv } from "vite";

// expose electron.
global.__electron__ = electron;

// load environment variables.
const env = loadEnv("development", process.cwd());
process.env = { ...process.env, ...env };

const viteServer = await createServer({ root: "./src/renderer" });
await viteServer.listen();
viteServer.printUrls();
console.debug("version:", app.getVersion());
