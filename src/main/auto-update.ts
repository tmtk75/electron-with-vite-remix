import logger from "electron-log";
import type {
  AppUpdater,
  UpdateDownloadedEvent,
  UpdateInfo,
} from "electron-updater";
// NOTE: workaround to use electron-updater.
import * as electronUpdater from "electron-updater";
const autoUpdater: AppUpdater = (electronUpdater as any).default.autoUpdater;
// const logger = console;

export async function setupAutoUpdater() {
  autoUpdater.on("checking-for-update", () => {
    logger.info("checking-for-update...");
  });
  autoUpdater.on("update-available", (info: UpdateInfo) => {
    logger.info("Update available.", info);
  });
  autoUpdater.on("update-not-available", (/* no arguments */) => {
    logger.info("Update not available.");
  });
  autoUpdater.on("error", (err, msg) => {
    logger.info(
      "Error in auto-updater.",
      JSON.stringify(err),
      "message:",
      JSON.stringify(msg)
    );
  });
  autoUpdater.on("update-downloaded", (event: UpdateDownloadedEvent) => {
    logger.info("Update downloaded.", formatUpdateDownloadedEvent(event));
  });

  logger.transports.file.level = "debug";
  autoUpdater.logger = logger;
  // autoUpdater.autoDownload = false;
  // autoUpdater.autoInstallOnAppQuit = false;

  try {
    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      logger.info("catch err:", err);
    });
    const start = async () => {
      logger.info(
        "electron-updater: autoUpdater started.",
        autoUpdater.currentVersion.version
      );
      logger.info(
        "electron-updater: isUpdaterActive:",
        autoUpdater.isUpdaterActive()
      );
      const updates = await autoUpdater.checkForUpdates();
      logger.info("checkForUpdates:", updates);
      if (!updates) {
        logger.info("no found updates.");
        return;
      }
      const dl = await autoUpdater.downloadUpdate();
      logger.info("electron-updater: downloadUpdate:", dl);
    };
    start();
  } catch (err) {
    logger.error("auto-updater:", err);
  }

  autoUpdater.signals.login((i) => logger.info(i));
  autoUpdater.signals.progress((i) => logger.info("signal progress:", i));
  autoUpdater.signals.updateCancelled((i) =>
    logger.info("signal updateCancelled:", i)
  );
  autoUpdater.signals.updateDownloaded((i) =>
    logger.info("signal updateDownloaded:", i)
  );
}

function formatUpdateDownloadedEvent(event: UpdateDownloadedEvent): string {
  return JSON.stringify({
    version: event.version,
    downloadedFile: event.downloadedFile,
    files: event.files.map((e) => ({ files: { url: e.url, size: e.size } })),
  });
}
