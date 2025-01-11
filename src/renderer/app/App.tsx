import { useEffect } from "react";
import { Button } from "./components/ui/button";

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
    </div>
  );
};

export default App;
