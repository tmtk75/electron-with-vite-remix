import type { TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import type { RootRouter } from "../../../main/trpc/rootRouter";
import type { TRPCBridge } from "./trpc-bridge";

//
// NOTE: ensure the key in window though this type itself is not used anywhere.
//       exported, but not referred. This is for type checking.
//
type _ensureExistence = globalThis.Window[TRPCBridge.ContextKeyName];

export const ipcLink: TRPCLink<RootRouter> = (runtime) => {
  const api = globalThis?.window?.__$ipc__;
  if (!api) {
    console.info("trpc: no given api. returns null link.");
    return () =>
      // NOTE: this is needed to return null in in-browser.
      observable((observer) => {
        observer.next({
          context: undefined,
          result: {
            type: "data",
            data: null,
          },
        });

        // complete this invocation.
        observer.complete();
        return () => {};
      });
  }
  console.info("trpc: ipcLink: runtime:", runtime);

  return ({ op }) =>
    observable((observer) => {
      console.debug("trpc:", "performing operation:", op);
      api
        .trpc(op)
        .then((r: any) => {
          console.debug("trpc: op:", { ...r });
          observer.next({
            context: { foo: 1234 }, // NOTE: context sample.
            result: {
              type: "data",
              // data: { greeting: r.msg, id: r.id ?? 112233 },
              ...r,
            },
          });
          observer.complete();
        })
        .catch((err) => {
          console.error("trpc: ipcLink: err:", err, op);
          observer.error(err);
        });
      return () => {
        console.debug("trpc: observable: tear-down.", op.id);
      };
    });
};
