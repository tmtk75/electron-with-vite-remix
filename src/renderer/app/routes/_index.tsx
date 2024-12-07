/// <reference types="vite/client" />

import type { Route } from "./+types/_index";
import { NavLink, useLoaderData } from "react-router";
import App from "../App";
import { ipcTRPC } from "../trpc/TRPCReactProvider";
// import log from "electron-log/renderer"; // TOOD: check how to effectively use electron-log in renderer

const isDev = import.meta.env.DEV;
console.debug("renderer: isDev:", isDev);
console.debug("renderer: import.meta.env:", import.meta.env);

export default function Index() {
  const v: Route.MetaArgs["data"] = useLoaderData();
  console.debug("loaderData:", v);

  const getPath = ipcTRPC.ipc.getPath.useQuery("home");
  const e = ipcTRPC.ipc.loginItemSettings.useQuery();

  return (
    <main className="container mx-auto p-8 grid gap-4">
      <div>
        <h1 className="font-bold text-xl">
          Electron + React Router + Vite + TailwindCSS
        </h1>
        <ul className="list-disc list-inside text-sm">
          <li>Electron API is available through IPC on tRPC.</li>
          <li>React Router framework.</li>
          <li>Built by Vite.</li>
          <li>Styled by TailwindCSS v3. (v4 will be supported)</li>
        </ul>
      </div>

      <div>
        <h2 className="font-bold">Given by Electron API</h2>
        <p className="text-sm">
          version:{" "}
          <code className="bg-slate-200 p-1 rounded-sm text-[10px]">
          {getPath.data}{/* {v.version} */}
          </code>
        </p>
        <p className="text-sm">
          userData:{" "}
          <code className="bg-slate-200 p-1 rounded-sm text-[10px]">
          {e.data?.status}{/* {v.userData} */}
          </code>
        </p>
      </div>

      <App />

      <div>
        <h2 className="font-bold">Routing</h2>
        <NavLink to="/welcome" className="hover:underline text-sm">
          To Welcome page
        </NavLink>
      </div>
    </main>
  );
}
