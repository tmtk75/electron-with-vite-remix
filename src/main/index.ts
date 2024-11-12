// import { app, BrowserWindow } from "electron";
import path, { dirname } from "node:path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createWindow = (BrowserWindow: any) => {
  const win = new BrowserWindow({
    // width: 800,
    // height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:5173");
  // win.loadFile("index.html");
};

(async () => {
  const { app, BrowserWindow } = await import("electron");

  app.whenReady().then(() => {
    createWindow(BrowserWindow);

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow(BrowserWindow);
      }
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
})();
