import { app, BrowserWindow } from "electron";
import { ipcMain } from "electron";
import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    // width: 800,
    // height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.cjs"),
    },
  });

  win.loadURL("http://localhost:5173");
  // win.loadFile("index.html");

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
