import type { TRPCProcedureType } from "@trpc/server";

namespace TRPCBridge {
  type IPCChannelName = "electron:ipc:trpc";

  type ContextKeyName = "__$ipc__";

  interface HandlerArgs {
    path: string;
    type: TRPCProcedureType; // FIXME: use <reference />
    input?: unknown;
  }

  interface ExposedIPCInstance {
    trpc: (a: HandlerArgs) => Promise<void>;
    on: (channel: string, func: (...args: any[]) => void) => () => void;
  }
}

declare global {
  interface Window {
    __$ipc__?: TRPCBridge.ExposedIPCInstance;
  }
}
