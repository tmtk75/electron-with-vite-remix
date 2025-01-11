import { useEffect } from "react";
import { Button } from "./components/ui/button";
import { useLoaderData } from "react-router";

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

const App = () => {
  const userData = useLoaderData<typeof loader>();

  useEffect(() => {
    if (!window.ipc) {
      return;
    }
    console.debug("register.on");
    const dispose = window.ipc.on("ping", function (...args) {
      console.debug("ipc: main -> renderer", JSON.stringify(args));
    });
    return () => {
      console.debug("dispose.on");
      dispose();
    };
  });

  return (
    <div className="text-sm">
      <Button
        onClick={async () => {
          const v = await window.ipc?.invoke({ a: 1, b: 2 });
          console.log({ v });
        }}
        size="sm"
      >
        Send event
      </Button>{" "}
      to main through IPC.
      <div className="mt-4">
        <p>version: {userData.version}</p>
        <p>userData: {userData.userData}</p>
      </div>
    </div>
  );
};

export default App;
