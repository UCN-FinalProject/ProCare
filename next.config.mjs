/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "production" ? true : false,
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "production" ? true : false,
  },
};

export default config;
