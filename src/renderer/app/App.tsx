import { NavLink } from "@remix-run/react";
import { useEffect } from "react";
import "./App.css";

declare global {
  interface Window {
    ipc?: {
      on: (channel: string, func: (...args: any[]) => void) => () => void;
      invoke: (...args: any[]) => Promise<any>;
    };
  }
}

const App = () => {
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
    <div className="content">
      <h1>Vite with React</h1>
      <p>Start building amazing things with Vite.</p>
      <div>
        <button
          onClick={async () => {
            const v = await window.ipc?.invoke({ a: 1, b: 2 });
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
