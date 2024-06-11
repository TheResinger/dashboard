/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  async rewrites() {
    console.log("rewrites called");
    return [
      {
        source: "/admin/:slug*",
        destination: "/admin",
      },
    ];
  },
};

export default config;
