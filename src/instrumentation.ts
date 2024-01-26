import { env } from "process";

export async function register() {
  if (env.NODE_ENV === "development") return;
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { BaselimeSDK, VercelPlugin, BetterHttpInstrumentation } =
      await import("@baselime/node-opentelemetry");

    const sdk = new BaselimeSDK({
      serverless: true,
      service: "ProCare",
      instrumentations: [
        new BetterHttpInstrumentation({
          plugins: [new VercelPlugin()],
        }),
      ],
    });

    sdk.start();
  }
}
