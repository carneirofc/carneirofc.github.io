import type { NextConfig } from "next";

// @carneirofc/ui is consumed from the local deedlit.dev monorepo checkout
// (file: dependency). The aliases point straight at the package source so no
// prebuilt dist/ is required — Next transpiles it via `transpilePackages`.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  transpilePackages: ["@carneirofc/ui"],
  images: { unoptimized: true },
  turbopack: {
    // The UI package lives outside this repo (sibling checkout), so the
    // Turbopack root must span the parent directory that holds both repos.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    root: require("path").resolve(__dirname, ".."),
    resolveAlias: {
      "@carneirofc/ui": "../deedlit.dev/deedlit.dev.ui/src/index.ts",
      "@carneirofc/ui/styles.css": "../deedlit.dev/deedlit.dev.ui/styles/styles.css",
    },
  },
  webpack(config) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    config.resolve.alias["@carneirofc/ui"] = require("path").resolve(
      __dirname,
      "../deedlit.dev/deedlit.dev.ui/src/index.ts",
    );
    return config;
  },
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
