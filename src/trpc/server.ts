import "server-only";
import { headers } from "next/headers";
import { createTRPCContext } from "~/server/api/trpc";
import { cache } from "react";
import { createCaller } from "~/server/api/root";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");
  heads.set("cache-control", "no-cache");
  return createTRPCContext({
    req: {
      headers: heads,
    },
  });
});

export const api = createCaller(createContext);
