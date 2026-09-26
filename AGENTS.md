# Agent guide

Rules for anyone — human or agent — changing this repo. Read
[`CONTEXT.md`](./CONTEXT.md) (what the system is, its invariants) and
[`docs/adr/`](./docs/adr/) (why) before anything structural. When a decision
changes, add a superseding ADR; don't edit the old one.

## Before you finish

Velite runs before Next — `.velite/` doesn't exist until it does.

```sh
npm run lint && npm run typecheck && npm run build
node scripts/check-translations.mjs
```

## Types: Zod first

- Define every data shape as a Zod schema and derive the type with `z.infer`.
  Don't hand-write a `type`/`interface` for data. Component props and small
  internal helpers are fine as plain TS.
- Parse at every boundary: JSON, cookies, env, network responses, CLI/script
  input, exiftool output. Use `safeParse` where a bad value has a fallback,
  `parse` where it should fail the build.
- App and script code imports `z` from `"zod"` (v4). Content frontmatter uses
  Velite's `s` in `velite.config.ts` — keep it there.
- Examples: `projectEntrySchema` / `dictionarySchema` in `src/lib/i18n.ts`
  (parsed at module load, so a bad entry fails the build), `themeSchema` in
  `src/components/theme-toggle.tsx`, the schemas in `scripts/*.mjs`.

## Never `any`

- `@typescript-eslint/no-explicit-any` is an error. Take `unknown` and parse it.
- No `as` casts on untrusted data. The one permitted cast is the compiled MDX
  component in `src/components/mdx-content.tsx`: its props can't be checked at
  runtime, so it is guarded with a `typeof … === "function"` check first.

## Data fetching

The site is a static export (ADR 0002): read data at build time, in server
components. If client-side fetching is ever needed, use TanStack Query with a
`queryFn` that Zod-parses the response — never `useEffect` + `fetch`. Adding
it is a new dependency, so it gets an ADR.

## Repo conventions

- Dependencies: `@carneirofc/ui` is a `file:` sibling checkout (ADR 0003).
  Never use `--legacy-peer-deps`.
- Every route and published post exists in both `en` and `pt-br`; UI strings
  live in `src/lib/i18n.ts`. No mixed-language titles.
- Use icons (`react-icons/lu`), not decorative unicode glyphs.
- Internal links end in `/` (`trailingSlash: true`); no `basePath`.
- Conventional Commits. Record changes under `## [Unreleased]` in
  `CHANGELOG.md`.
