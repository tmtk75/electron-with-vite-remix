import { useEffect } from "react";

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
      <h2 className="font-bold">IPC is available</h2>
      <div>IPC is available, too.</div>
      <button
        onClick={async () => {
          const v = await window.ipc?.invoke({ a: 1, b: 2 });
          console.log({ v });
        }}
        className="bg-blue-500 text-white p-2 rounded-sm text-xs shadow-xs hover:bg-blue-600"
      >
        Send event
      </button> to main through IPC.
    </div>
  );
};

export default App;
