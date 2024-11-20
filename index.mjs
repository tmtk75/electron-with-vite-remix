import { app } from "electron";
import { createServer } from "vite";
const viteServer = await createServer({
  // configFile: "./src/renderer/vite.config.ts",
  root: "./src/renderer",
});

global.app = app;

const listen = await viteServer.listen();
viteServer.printUrls();
console.log("version:", app.getVersion(), listen.config.server.port);
