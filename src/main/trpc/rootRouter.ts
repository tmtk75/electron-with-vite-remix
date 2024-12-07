import { initTRPC } from "@trpc/server";
import { app } from "electron";
import superjson from "superjson";
import { z } from "zod";

// sample context
const createContext = async () => {
  return { foo: "baz" };
};

type Context = Awaited<typeof createContext>;
const t = initTRPC.context<Context>().create({ transformer: superjson });

const ipc = t.router({
  version: t.procedure.query(() => app.getVersion()),

  getPath: t.procedure
    .input(z.enum(["home", "temp"] as const)) // for zod: https://zenn.dev/tyshgc/articles/c7a404481bf255
    .query(({ input }) => app.getPath(input)),

  loginItemSettings: t.procedure.query(() => app.getLoginItemSettings()),

  sendSomething: t.procedure
    .input(z.object({ a: z.string(), b: z.number() }))
    .mutation(({ input }) => {
      console.debug("sendSomething", input);
      return input.b + 100;
    }),
});

const root = initTRPC.create();
export const rootRouter = root.router({ ipc });
export type RootRouter = typeof rootRouter;
