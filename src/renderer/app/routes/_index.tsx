/// <reference types="vite/client" />

import { useLoaderData } from "@remix-run/react";
import App from "../App";

const isDev = import.meta.env.DEV;
console.debug("renderer: isDev:", isDev);

declare global {
  var __electron__: typeof Electron.CrossProcessExports;
}

async function importElectron() {
  if (isDev) {
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
