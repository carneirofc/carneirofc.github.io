import path from "node:path";
import type { NextConfig } from "next";

// @carneirofc/ui is consumed from the local deedlit.dev monorepo checkout
// (file: dependency). The aliases point straight at the package source so no
// prebuilt dist/ is required — Next transpiles it via `transpilePackages`.
const UI_SRC = "../deedlit.dev/deedlit.dev.ui/src/index.ts";
const UI_STYLES = "../deedlit.dev/deedlit.dev.ui/styles/styles.css";

// The UI sources live outside this repo, so their bare imports would resolve
// against deedlit.dev's node_modules (or nothing, in CI). Pin every package
// the UI imports to THIS repo's node_modules — one React copy, everywhere.
const SHARED_PACKAGES = [
  "react",
  "react-dom",
  "radix-ui",
  "class-variance-authority",
  "clsx",
  "tailwind-merge",
];

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  transpilePackages: ["@carneirofc/ui"],
  images: { unoptimized: true },
  turbopack: {
    // The Turbopack root must span the parent directory that holds both repos.
    root: path.resolve(__dirname, ".."),
    resolveAlias: {
      "@carneirofc/ui": UI_SRC,
      "@carneirofc/ui/styles.css": UI_STYLES,
      "react/jsx-runtime": "./node_modules/react/jsx-runtime.js",
      "react/jsx-dev-runtime": "./node_modules/react/jsx-dev-runtime.js",
      ...Object.fromEntries(SHARED_PACKAGES.map((name) => [name, `./node_modules/${name}`])),
    },
  },
  webpack(config) {
    config.resolve.alias["@carneirofc/ui"] = path.resolve(__dirname, UI_SRC);
    for (const name of SHARED_PACKAGES) {
      config.resolve.alias[name] = path.resolve(__dirname, "node_modules", name);
    }
    return config;
  },
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
