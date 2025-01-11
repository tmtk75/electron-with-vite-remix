/// <reference types="vite/client" />
import { createReadableStreamFromReadable } from "@react-router/node";
import { app, BrowserWindow, ipcMain, Menu } from "electron";
import log from "electron-log"; // write logs into ${app.getPath("logs")}/main.log without `/main`.
import serve from "electron-serve";
import ElectronStore from "electron-store";
import mime from "mime";
import { createReadStream, promises as fs } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "url";
import { createServer, ViteDevServer } from "vite";
import * as pkg from "../../package.json";
import { setupAutoUpdater } from "./auto-update";
import { setupTRPC } from "./trpc/setupTRPC";
// log.initialize(); // inject a built-in preload script. https://github.com/megahertz/electron-log/blob/master/docs/initialize.md
Object.assign(console, log.functions);

console.debug("main: import.meta.env:", import.meta.env);

(() => {
  const root = global.process.env.APP_PATH_ROOT ?? import.meta.env.VITE_APP_PATH_ROOT;
  if (root === undefined) {
    console.info("no given APP_PATH_ROOT or VITE_APP_PATH_ROOT. default path is used.");
    return;
  }
  if (!isAbsolute(root)) {
    console.error("APP_PATH_ROOT must be absolute path.");
    global.process.exit(1);
  }

  console.info(`APP_PATH_ROOT: ${root}`);
  const subdirName = pkg.name;
  for (const [key, val] of [
    ["appData", ""],
    ["userData", subdirName],
    ["sessionData", subdirName],
  ] as const) {
    app.setPath(key, join(root, val));
  }

  app.setAppLogsPath(join(root, `${subdirName}/Logs`));
})();

console.debug("appPath:", app.getAppPath());
const keys: Parameters<typeof app.getPath>[number][] = ["home", "appData", "userData", "sessionData", "logs", "temp"];
keys.forEach((key) => console.debug(`${key}:`, app.getPath(key)));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directory = join(__dirname, "../renderer/client"); // This file is in the above (a). To point the `out`, move up twice.
console.debug("loadURL: directory:", directory);
const loadURL = serve({ directory });

const isDev = !(global.process.env.NODE_ENV === "production" || app.isPackaged);
console.debug("main: isDev:", isDev);
console.debug("NODE_ENV:", global.process.env.NODE_ENV);
console.debug("isPackaged:", app.isPackaged);

const store = new ElectronStore<any>({ encryptionKey: "something" });

setupTRPC();

const createWindow = async (rendererURL: string) => {
  const bounds = store.get("bounds");
  console.debug("restored bounds:", bounds);

  const win = new BrowserWindow({
    ...{
      width: 800,
      height: 600,
      ...bounds,
    },
    webPreferences: {
      preload: join(__dirname, "../preload/index.cjs"),
    },
  });

  if (isDev) {
    console.debug("loadURL: rendererURL:", rendererURL);
    win.loadURL(rendererURL);
  } else {
    loadURL(win);
  }

  const boundsListener = () => {
    const bounds = win.getBounds();
    store.set("bounds", bounds);
  };
  win.on("moved", boundsListener);
  win.on("resized", boundsListener);

  return win;
};

console.time("start whenReady");
let viteServer: ViteDevServer;

(async () => {
  await app.whenReady();
  const rendererURL = await (isDev
    ? (async () => {
        viteServer = await createServer({
          root: "./src/renderer",
          envDir: join(__dirname, "../.."), // load .env files from the root directory.
        });
        const listen = await viteServer.listen();
        viteServer.printUrls();
        return `http://localhost:${listen.config.server.port}`;
      })()
    : directory);
  const win = createWindow(rendererURL);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(rendererURL);
    }
  });

  console.timeEnd("start whenReady");
  return win;
})()
  .then((win) => {
    // IPC samples : send and recieve.
    let count = 0;
    setInterval(
      () => win.webContents.send("ping", `hello from main! ${count++}`),
      5 * 1000
    );
    ipcMain.handle("ipcTest", (event, ...args) =>
      console.debug("ipc: renderer -> main", { event, ...args })
    );
    return win;
  })
  .then((win) => setupMenu(win));

//
// Menu: append Go -> Back, Forward
//
const setupMenu = (win: BrowserWindow): void => {
  const app = Menu.getApplicationMenu();
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      ...(app ? app.items : []),
      {
        label: "Go",
        submenu: [
          {
            label: "Back",
            accelerator: "CmdOrCtrl+[",
            click: () => {
              win?.webContents.navigationHistory.goBack();
            },
          },
          {
            label: "Forward",
            accelerator: "CmdOrCtrl+]",
            click: () => {
              win?.webContents.navigationHistory.goForward();
            },
          },
        ],
      },
    ]),
  );
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//
// take care of vite-dev-server.
//
app.on("before-quit", async (_event) => {
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

// serve assets built by vite.
export async function serveAsset(req: Request, assetsPath: string): Promise<Response | undefined> {
  const url = new URL(req.url);
  const fullPath = join(assetsPath, decodeURIComponent(url.pathname));
  if (!fullPath.startsWith(assetsPath)) {
    return;
  }

  const stat = await fs.stat(fullPath).catch(() => undefined);
  if (!stat?.isFile()) {
    // Nothing to do for directories.
    return;
  }

  const headers = new Headers();
  const mimeType = mime.getType(fullPath);
  if (mimeType) {
    headers.set("Content-Type", mimeType);
  }

  const body = createReadableStreamFromReadable(createReadStream(fullPath));
  return new Response(body, { headers });
}

// Reload on change.
let isQuited = false;

const abort = new AbortController();
const { signal } = abort;
(async () => {
  const dir = join(__dirname, "../../out");
  try {
    const watcher = fs.watch(dir, { signal, recursive: true });
    for await (const _event of watcher) {
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

setupAutoUpdater();
