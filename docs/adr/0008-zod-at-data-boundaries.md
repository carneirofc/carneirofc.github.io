# 8. Zod schemas as the source of data types

- **Status:** Accepted
- **Date:** 2026-09-26

## Context

Content frontmatter was already Zod-validated through Velite
([ADR 0004](./0004-velite-content-layer.md)), but nothing else was. The projects
list and UI strings in `src/lib/i18n.ts` were hand-written TypeScript types, so
a malformed URL or a docs link without a label type-checked and shipped. The
theme cookie was cast straight to `ThemeMode`, and the CI check scripts trusted
`JSON.parse`, which returns `any`.

## Decision

Every data shape is a Zod schema, and its type comes from `z.infer`. Data is
parsed where it enters: module load for the dictionaries (so a bad entry fails
`next build`), `safeParse` for the cookie, and schema checks for the JSON the
scripts read. `any` is banned by lint (`@typescript-eslint/no-explicit-any` is
an error). The rules live in [`AGENTS.md`](../../AGENTS.md).

App and script code depends on `zod` v4 directly. Velite collections keep using
Velite's `s`.

## Alternatives rejected

- **Velite's re-exported `z`.** No new dependency, but it is a bundled Zod 3,
  pinned to whatever Velite ships. It also can't infer recursive types (the hast
  node schema in `velite.config.ts` needs Zod 4's getter form).
- **Plain TypeScript types.** They check nothing at runtime, and runtime is
  where the drift shows up: a hand-edited entry, a stale cookie, a changed tool
  output.

## Consequences

- Two Zod versions are installed: Velite's bundled 3 and the direct 4. They
  never exchange schemas, so that's harmless.
- Function-valued dictionary fields (`tagDescription`, `minRead`) are checked
  only for being functions (`z.custom`).
- The compiled MDX component can't be meaningfully parsed. It is guarded with
  a `typeof` check and cast once, in `src/components/mdx-content.tsx`.
