import { useLoaderData } from "@remix-run/react";
import App from "../App";

async function importElectron() {
  if (process.env.NODE_ENV !== "production") {
    return global.__electron__;
  }
  return import("electron");
}

const { app } = await importElectron();

export const loader = async () => {
  // const { app } = await import("electron"); // doesn't work on remix:dev (vite-dev-server)

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
  import("electron").then(({ app }) => {
    // NOTE: this runs in the main process but an error is shown in the renderer process
    //       > Uncaught (in promise) ReferenceError: __dirname is not defined

    console.debug("version", app.getVersion()); // app is undefined if vite-dev-server
  });
  console.debug("loaderData:", v);
  return (
    <>
      {JSON.stringify(v)}
      <App />
    </>
  );
}
