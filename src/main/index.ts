import {
  createReadableStreamFromReadable,
  createRequestHandler,
} from "@remix-run/node";
import { app, BrowserWindow, ipcMain, protocol } from "electron";
import electron from "electron";
import ElectronStore from "electron-store";
import mime from "mime";
import { promises as fs, createReadStream } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "url";
import { createServer, ViteDevServer } from "vite";

console.debug("appPath:", app.getAppPath());
const keys: Parameters<typeof app.getPath>[number][] = [
  "home",
  "appData",
  "userData",
  "sessionData",
  "logs",
  "temp",
];
keys.forEach((key) => console.debug(`${key}:`, app.getPath(key)));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = !(process.env.NODE_ENV === "production" || app.isPackaged);
console.debug("main: isDev:", isDev);
console.debug("NODE_ENV:", process.env.NODE_ENV);
console.debug("isPackaged:", app.isPackaged);

const store = new ElectronStore<any>({ encryptionKey: "something" });

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

  console.debug("loadURL: rendererURL:", rendererURL);
  win.loadURL(rendererURL);

  const boundsListener = () => {
    const bounds = win.getBounds();
    store.set("bounds", bounds);
  };
  win.on("moved", boundsListener);
  win.on("resized", boundsListener);
};

console.time("start whenReady");
const rendererClientPath = join(__dirname, "../renderer/client");
let viteServer: ViteDevServer;

(async () => {
  await app.whenReady();
  const serverBuild = isDev
    ? null // serverBuild is not used in dev.
    : await import(join(__dirname, "../renderer/server/index.js"));
  protocol.handle("http", async (req) => {
    const url = new URL(req.url);
    if (
      !["localhost", "127.0.0.1"].includes(url.hostname) ||
      (url.port && url.port !== "80")
    ) {
      return await fetch(req);
    }

    req.headers.append("Referer", req.referrer);
    try {
      const res = await serveAsset(req, rendererClientPath);
      if (res) {
        return res;
      }

      const handler = createRequestHandler(serverBuild, "production");
      return await handler(req, {
        /* context */
      });
    } catch (err) {
      console.warn(err);
      const { stack, message } = toError(err);
      return new Response(`${stack ?? message}`, {
        status: 500,
        headers: { "content-type": "text/html" },
      });
    }
  });

  const rendererURL = await (isDev
    ? (async () => {
        viteServer = await createServer({
          root: "./src/renderer", // configFile: "./src/renderer/vite.config.ts",
        });
        const listen = await viteServer.listen();
        global.__electron__ = electron;
        viteServer.printUrls();
        return "http://localhost:5173";
      })()
    : "http://localhost");

  createWindow(rendererURL);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(rendererURL);
    }
  });

  console.timeEnd("start whenReady");
})();

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

// serve assets built by vite.
export async function serveAsset(
  req: Request,
  assetsPath: string
): Promise<Response | undefined> {
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

function toError(value: unknown) {
  return value instanceof Error ? value : new Error(String(value));
}

// Reload on change.
let isQuited = false;

const abort = new AbortController();
const { signal } = abort;
(async () => {
  const dir = join(__dirname, "../../out");
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
