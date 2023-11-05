import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "~/server/api/root";
import { env } from "~/env.mjs";

const panelHandler = () => {
  if (env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }
  return new Response(
    renderTrpcPanel(appRouter, {
      url: "http://localhost:3000/api/trpc",
      transformer: "superjson",
    }),
    {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
      },
    },
  );
};

export { panelHandler as GET, panelHandler as POST };
