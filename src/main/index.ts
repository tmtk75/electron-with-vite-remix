import { app, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";
import { promises as fs } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
import { createServer, ViteDevServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const directory = path.join(__dirname, "../renderer/client"); // This file is in the above (a). To point the `out`, move up twice.
const loadURL = serve({ directory });

// console.info(JSON.stringify(import.meta.env, null, "  "));
// console.debug("", JSON.stringify(global.process.env, null, "  "));

const useDevServer = global.process.env.DEV_SERVER;
let viteServer: ViteDevServer;

const createWindow = async () => {
  const port = useDevServer
    ? await (async () => {
        viteServer = await createServer({
          configFile: "./src/renderer/vite.config.ts",
          root: "./src/renderer",
          server: {
          },
        });
        const listen = await viteServer.listen();
        viteServer.printUrls();
        return listen.config.server.port;
      })()
    : global.process.env.PORT ?? 5173;

  const win = new BrowserWindow({
    // width: 800,
    // height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.cjs"),
    },
  });

  const rendererURL =
    global.process.env.RENDERER_URL ?? `http://localhost:${port}`;

  if (!app.isPackaged && rendererURL) {
    console.debug("loadURL: rendererURL:", rendererURL);
    win.loadURL(rendererURL);
  } else {
    console.debug("loadURL: directory:", directory);
    loadURL(win);
  }

  let count = 0;
  setInterval(() => {
    console.debug("send ping", count);
    win.webContents.send("ping", `whoooooooh! ${count++}`);
  }, 5000);
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC sample
ipcMain.handle("ipcTest", async (event, ...args) => {
  console.debug("ipc: renderer -> main", { event, ...args });
  return;
});

//
// take care of vite-dev-server.
//
app.on("before-quit", async (event) => {
  if (!viteServer) {
    return;
  }
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

// Reload on change.
let isQuited = false;

const abort = new AbortController();
const { signal } = abort;
(async () => {
  const dir = path.join(__dirname, "../../out");
  try {
    const watcher = fs.watch(dir, { signal, recursive: true });
    for await (const event of watcher) {
      if (!isQuited) {
        isQuited = true;
        app.relaunch();
        app.quit();
      }
    }
  } catch (err) {
    if (!(err instanceof Error)) {
      throw err;
    }
    if (err.name === "AbortError") {
      console.debug("abort watching:", dir);
      return;
    }
  }
})();
