import { useLoaderData } from "@remix-run/react";
import App from "../App";
import { electron } from "../electron.server";
// import electron from "electron";

export const loader = async (r) => {
  console.debug("app:", global.app.getVersion());
  console.debug("app:", global.app.getPath("userData"));
  return {
    version: app.getVersion(),
  };
};

export default function Index() {
  const v = useLoaderData();
  // console.log({ app: global.app });
  return (
    <>
      {JSON.stringify(v)}
      <App />
    </>
  );
}
