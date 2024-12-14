/// <reference types="vite/client" />
import { useLoaderData } from "@remix-run/react";
// import log from "electron-log/renderer"; // TOOD: check how to effectively use electron-log in renderer
import { Button } from "../../components/ui/button";
import { CommandDemo } from "./CommandDemo";
import { LayoutWithSidebar } from "./LayoutWithSidebar";

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
    <LayoutWithSidebar>
      <div className="w-[calc(100vw-16rem)]">
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <p className="text-sm">{JSON.stringify(v)}</p>
            <Button size="sm" onClick={() => alert("hi")}>OK</Button>
          </div>
          <div>
            <CommandDemo />
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}
