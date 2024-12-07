/// <reference types="vite/client" />

import { useLoaderData } from "@remix-run/react";
import App from "../App";
import { ipcTRPC } from "../trpc/TRPCReactProvider";
// import log from "electron-log/renderer"; // TOOD: check how to effectively use electron-log in renderer

const isDev = import.meta.env.DEV;
console.debug("renderer: isDev:", isDev);
console.debug("renderer: import.meta.env:", import.meta.env);

export default function Index() {
  const v = useLoaderData();
  console.debug("loaderData:", v);

  const getPath = ipcTRPC.ipc.getPath.useQuery("home");
  const e = ipcTRPC.ipc.loginItemSettings.useQuery();

  return (
    <>
      <div>getPath: {getPath.data}</div>
      <div>loginItemSettings.status: {e.data?.status}</div>
      <App />
    </>
  );
}
