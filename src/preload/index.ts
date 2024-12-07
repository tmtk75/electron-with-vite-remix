import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";
import type { TRPCBridge } from "../renderer/app/trpc/trpc-bridge";

console.debug("start preload.", ipcRenderer);

const channel: TRPCBridge.IPCChannelName = "electron:ipc:trpc";

const ipc: TRPCBridge.ExposedIPCInstance = {
  trpc: (args) => ipcRenderer.invoke(channel, args),
  on(channel: string, func: Function) {
    const f = (event: IpcRendererEvent, ...args: any[]) =>
      func(...[event, ...args]);
    console.debug("register listener", channel, f);
    ipcRenderer.on(channel, f);
    return () => {
      console.debug("remove listener", channel, f);
      ipcRenderer.removeListener(channel, f);
    };
  },
};

// https://blog.katsubemakito.net/nodejs/electron/ipc-for-contextbridge
const ipcName: TRPCBridge.ContextKeyName = "__$ipc__";
contextBridge.exposeInMainWorld(ipcName, ipc);
