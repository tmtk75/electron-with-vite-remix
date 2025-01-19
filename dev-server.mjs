// @ts-check
//
// simple vite-dev-server to develop.
//
import electron, { app } from "electron";
import { createServer, loadEnv } from "vite";

// expose electron.
global.__electron__ = electron;

// load environment variables.
const env = loadEnv("development", process.cwd());
process.env = { ...process.env, ...env };

const viteServer = await createServer({
  root: "./src/renderer",
  // envDir: join(__dirname, "."), // load .env files from the root directory.
});
const listen = await viteServer.listen();
viteServer.printUrls();
console.debug("version:", app.getVersion());

// dev:main
if (process.env.DEV_MAIN) {
  process.env.RENDERER_URL = `http://localhost:${listen.config.server.port}`;
  import("./out/main/index.mjs");

  // take care of vite-dev-server. without this, the app will complain at quit.
  app.on("before-quit", async (_event) => {
    // ref: https://stackoverflow.com/questions/68750716/electron-app-throwing-quit-unexpectedly-error-message-on-mac-when-quitting-the-a
    // event.preventDefault();
    try {
      console.info("will close vite-dev-server.");
      await viteServer.close();
      console.info("closed vite-dev-server.");
      // app.quit(); // Not working. causes recursively 'before-quit' events.
      app.exit(); // Not working expectedly SOMETIMES. Still throws exception and macOS shows dialog.
      // global.process.exit(0); // Not working well... I still see exceptional dialog.
    } catch (err) {
      console.error("failed to close Vite server:", err);
    }
  });
}
