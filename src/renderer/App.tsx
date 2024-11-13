import { useEffect } from "react";
import "./App.css";

declare global {
  interface Window {
    ipc: {
      on: (channel: string, func: (...args: any[]) => void) => () => void;
      invoke: (...args: any[]) => Promise<any>;
    };
  }
}

const App = () => {
  useEffect(() => {
    const dispose = window.ipc.on("ping", function (...args) {
      return `Hello from React, ${JSON.stringify(args)}`;
    });
    return () => {
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
            const v = await window.ipc.invoke({ a: 1, b: 2 });
            console.log({ v });
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default App;
