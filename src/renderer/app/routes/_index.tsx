/// <reference types="vite/client" />

import type { Route } from "./+types/_index";
import { NavLink, useLoaderData } from "react-router";
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
  const v: Route.MetaArgs["data"] = useLoaderData();
  return (
    <main className="container mx-auto p-8 grid gap-4">
      <div>
        <h1 className="font-bold text-xl">
          Electron + React Router + Vite + TailwindCSS
        </h1>
        <ul className="list-disc list-inside text-sm">
          <li>Electron API is available in loader and action.</li>
          <li>React Router framework.</li>
          <li>Built by Vite.</li>
          <li>Styled by TailwindCSS v4.</li>
        </ul>
      </div>

      <div>
        <h2 className="font-bold">Given by Electron API</h2>
        <p className="text-sm">
          version:{" "}
          <code className="bg-slate-200 p-1 rounded-xs text-[10px]">
            {v.version}
          </code>
        </p>
        <p className="text-sm">
          userData:{" "}
          <code className="bg-slate-200 p-1 rounded-xs text-[10px]">
            {v.userData}
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
