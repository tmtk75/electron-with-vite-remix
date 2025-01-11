/// <reference types="vite/client" />
// import log from "electron-log/renderer"; // TOOD: check how to effectively use electron-log in renderer
import { CommandDemo } from "./CommandDemo";
import Page from "../../components/page";
import { ipcTRPC } from "../../trpc/TRPCReactProvider";
import App from "../../App";

const isDev = import.meta.env.DEV;
console.debug("renderer: isDev:", isDev);
console.debug("renderer: import.meta.env:", import.meta.env);

export default function Index() {
  const getPath = ipcTRPC.ipc.getPath.useQuery("home");
  const e = ipcTRPC.ipc.loginItemSettings.useQuery();

  return (
    <>
      <Page>
        <div>
          <p className="text-sm">getPath: {getPath.data}</p>
          <p className="text-sm">status: {e.data?.status}</p>
          <p className="text-sm">
            This is an exmpale with shadcn/ui{" "}
            <a href="https://ui.shadcn.com/blocks" className="underline">
              buidling block sidebar-15
            </a>
          </p>
          <App />
        </div>
      </Page>
      <div className="z-10 fixed top-64 right-64 w-[500px] p-4">
        <CommandDemo />
      </div>
    </>
  );
}
