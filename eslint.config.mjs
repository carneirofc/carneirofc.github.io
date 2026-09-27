import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  {
    ignores: ["node_modules/**", ".next/**", "out/**", ".velite/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // AGENTS.md: never `any` — take `unknown` and parse it with Zod.
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
    },
  },
  {
    // Pages Router rule. It treats any file outside an `app/` path as a page,
    // so it flags SiteShell's <head>, which is the root layout's <head>.
    // There is no pages/ directory here (ADR 0002), and next/head, which
    // the rule suggests, does nothing in the App Router.
    rules: { "@next/next/no-head-element": "off" },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
      },
    },
  },
]);

export default eslintConfig;
