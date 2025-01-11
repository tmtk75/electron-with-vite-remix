/// <reference types="vite/client" />
import { useLoaderData } from "react-router";
// import log from "electron-log/renderer"; // TOOD: check how to effectively use electron-log in renderer
import { Button } from "../../components/ui/button";
import { CommandDemo } from "./CommandDemo";
import Page from "../../components/page";
import App from "../../App";

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
  return (
    <>
      <Page>
        <div className="grid grid-cols-1 gap-4 p-4">
          <div className="mt-[300px]">
            <App />

            <div className="mt-4">
              <h1 className="font-bold">loaderData</h1>
              <p className="text-sm">{JSON.stringify(v)}</p>
            </div>

            <p className="text-sm mt-4">
              This is an exmpale with shadcn/ui{" "}
              <a href="https://ui.shadcn.com/blocks" className="underline">
                buidling block sidebar-09
              </a>
            </p>
          </div>
        </div>
      </Page>
      <div className="z-10 fixed top-0 right-0 w-[500px] p-4">
        <CommandDemo />
      </div>
    </>
  );
}
