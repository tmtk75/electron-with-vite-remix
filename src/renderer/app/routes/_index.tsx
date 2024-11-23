import { useLoaderData } from "@remix-run/react";
import App from "../App";

// const { app } = global.electron;

export const loader = async () => {
  const { app } = await import("electron");

  const version = app.getVersion();
  const userData = app.getPath("userData");
  console.debug("version:", version, "userData:", userData);
  return {
    v: 1234,
    userData,
    version,
  };
};

export default function Index() {
  const v = useLoaderData();
  import("electron").then(({ app }) => {
    // NOTE: this runs in the main process but an error is shown in the renderer process
    //       > Uncaught (in promise) ReferenceError: __dirname is not defined
    console.debug("version", app.getVersion());
  });
  console.debug("loaderData:", v);
  return (
    <>
      {JSON.stringify(v)}
      <App />
    </>
  );
}
