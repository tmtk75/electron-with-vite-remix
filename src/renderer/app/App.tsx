import { NavLink } from "@remix-run/react";
import { useEffect } from "react";
import "./App.css";
import { ipcTRPC } from "./trpc/TRPCReactProvider";

const App = () => {
  const getPath = ipcTRPC.ipc.sendSomething.useMutation();

  useEffect(() => {
    const api = globalThis?.window?.__$ipc__;
    if (!api) {
      return;
    }
    console.debug("register.on");
    const dispose = api.on("ping", function (...args) {
      console.debug("ipc: main -> renderer", JSON.stringify(args));
    });
    return () => {
      console.debug("dispose.on");
      dispose();
    };
  });

  return (
    <div className="content">
      <h1>Vite with React</h1>
      <p>Start building amazing things with Vite.</p>
      <div>
        <button
          onClick={async () => {
            const v = await getPath.mutateAsync({ a: "hello", b: 123 });
            console.log({ v });
          }}
        >
          Send event to main
        </button>{" "}
        |<NavLink to="/welcome">Welcome</NavLink>
      </div>
    </div>
  );
};

export default App;
