/// <reference types="vite/client" />

import { useLoaderData } from "@remix-run/react";
import App from "../App";
// import log from "electron-log/renderer"; // TOOD: check how to effectively use electron-log in renderer

const isDev = import.meta.env.DEV;
console.debug("renderer: isDev:", isDev);
console.debug("renderer: import.meta.env:", import.meta.env);

declare global {
  var __electron__: typeof Electron.CrossProcessExports;
}

async function importElectron() {
  if (isDev) {
    // electron is exposed as a global variable in dev mode.
    return global.__electron__;
  }
  return import("electron"); // doesn't work on remix:dev (vite-dev-server)
}

export const loader = async () => {
  const { app } = await importElectron();

  const version = app.getVersion();
  const userData = app.getPath("userData");
  console.debug("version:", version, "userData:", userData);
  return {
    userData,
    version,
  };
};

export default function Index() {
  const v = useLoaderData();
  console.debug("loaderData:", v);
  return (
    <>
      {JSON.stringify(v)}
      <App />
    </>
  );
}
