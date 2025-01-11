import { useEffect } from "react";
import { Button } from "./components/ui/button";
import { ipcTRPC } from "./trpc/TRPCReactProvider";

const App = () => {
  const getPath = ipcTRPC.ipc.sendSomething.useMutation();

  useEffect(() => {
    if (!window.__$ipc__) {
      return;
    }
    console.debug("register.on");
    const dispose = window.__$ipc__.on("ping", function (...args) {
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
          const v = await getPath.mutateAsync({ a: "hello", b: 123 });
          console.log({ v });
        }}
        size="sm"
      >
        Send event
      </Button>{" "}
      to main through IPC on tRPC.
    </div>
  );
};

export default App;
