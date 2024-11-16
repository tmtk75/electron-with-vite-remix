import { app, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";
import { promises as fs } from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const directory = path.join(__dirname, "../renderer"); // This file is in the above (a). To point the `out`, move up twice.
const loadURL = serve({ directory });
console.debug("loadURL: directory:", directory);

// console.info(JSON.stringify(import.meta.env, null, "  "));
// console.debug("", JSON.stringify(global.process.env, null, "  "));

const createWindow = async () => {
  const win = new BrowserWindow({
    // width: 800,
    // height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.cjs"),
    },
  });

  // win.loadURL("http://localhost:5173");
  // .debug("loadURL: directory:", directory);

  loadURL(win);

  let count = 0;
  setInterval(() => {
    console.debug("send ping", count);
    win.webContents.send("ping", `whoooooooh! ${count++}`);
  }, 1000);
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
  if (process.platform !== "darwin") app.quit();
});

// IPC sample
ipcMain.handle("ipcTest", async (event, ...args) => {
  console.debug("ipc: renderer -> main", { event, ...args });
  return;
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
