import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import type * as React from "react";
import type { RootRouter } from "../../../main/trpc/rootRouter";
import { ipcLink } from "./ipcLink";

export const ipcTRPC = createTRPCReact<RootRouter>();

const trpcClient = ipcTRPC.createClient({
  links: [ipcLink],
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: true } },
});

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ipcTRPC.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </ipcTRPC.Provider>
    </QueryClientProvider>
  );
}
