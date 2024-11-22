import electron from "electron";
import { createServer } from "vite";
const viteServer = await createServer({
  // configFile: "./src/renderer/vite.config.ts",
  root: "./src/renderer",
});

global.electron = electron;

const listen = await viteServer.listen();
viteServer.printUrls();
