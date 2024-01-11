/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  typescript: {
    ...(process.env.NODE_ENV === "production" && {
      ignoreBuildErrors: true,
    }),
  },
  eslint: {
    ...(process.env.NODE_ENV === "production" && {
      ignoreDuringBuilds: true,
    }),
  },
  experimental: {
    instrumentationHook: true,
  },
};

export default config;
