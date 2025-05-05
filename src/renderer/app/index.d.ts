namespace IPCBridge {
  type ContextKeyName = "__$ipc__";

  interface ExposedIPCInstance {
    on: (channel: string, func: (...args: any[]) => void) => () => void;
    invoke(...args: any[]): Promise<any>;
  }
}

declare global {
  interface Window {
    ipc?: IPCBridge.ExposedIPCInstance;
  }
}
