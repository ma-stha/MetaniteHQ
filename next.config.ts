import type { NextConfig } from "next";

// Cache Components is deliberately OFF for v1. Every page in this app is
// behind a login, so there is nothing useful to prerender. Turning it on
// forces Suspense boundaries around every session read, which is extra
// complexity with no benefit here. See docs/decisions/0001-cache-components-off.md
const nextConfig: NextConfig = {
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
