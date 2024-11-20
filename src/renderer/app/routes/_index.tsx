import { useLoaderData } from "@remix-run/react";
import App from "../App";
import { electron } from "../electron.server";

export const loader = async () => {
  console.debug({ electron });
  return {
    // userDataPath: electron.app.getPath("userData"),
  };
};

export default function Index() {
  const v = useLoaderData();
  return <App />;
}
