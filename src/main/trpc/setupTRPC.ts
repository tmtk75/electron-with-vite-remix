import type { Operation } from "@trpc/client";
import { callProcedure } from "@trpc/server";
import type { IpcMainInvokeEvent } from "electron";
import { ipcMain } from "electron";
import { TRPCBridge } from "../../renderer/app/trpc/trpc-bridge";
import { rootRouter } from "./rootRouter";

const channel: TRPCBridge.IPCChannelName = "electron:ipc:trpc";

export function setupTRPC() {
  console.debug("setup TRPC.");
  ipcMain.handle(channel, (_event: IpcMainInvokeEvent, op: Operation) => {
    return resolveTRPCOperation(op);
  });
}

async function resolveTRPCOperation(args: Operation<unknown>) {
  const { procedures } = rootRouter._def;
  const { type, input: serInput } = args;
  const deinput = serInput; //transformer.input.deserialize(serInput) as unknown;

  try {
    const data = await callProcedure({
      ctx: {},
      path: args.path,
      procedures,
      getRawInput: () => Promise.resolve(deinput),
      type,
      signal: undefined,
    });

    return {
      input: deinput,
      path: args.path,
      data,
    };
  } catch (err) {
    console.error(
      new Date().toISOString(),
      "failed to callProcedure.",
      { args },
      err
    );
    throw err;
  }
}
