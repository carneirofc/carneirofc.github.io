# 10. Sibling checkout renamed to `deedlit.dev.ui`

- **Status:** Accepted — supersedes the paths in ADR 0003
- **Date:** 2026-10-10

## Context

ADR 0003 consumes `@carneirofc/ui` from a sibling checkout of the
`carneirofc/deedlit.dev` monorepo, at `../deedlit.dev/deedlit.dev.ui`. That
repo has since been renamed to `carneirofc/deedlit.dev.ui`; the public site
moved out to `deedlit.dev.portal`. A fresh clone now lands in
`deedlit.dev.ui/`, so the old path no longer resolves locally.

## Decision

Keep ADR 0003's approach unchanged and follow the rename: the dependency is
`"file:../deedlit.dev.ui/deedlit.dev.ui"`, and CI checks out
`carneirofc/deedlit.dev.ui` into `deedlit.dev.ui/`, still pinned by
`DEEDLIT_REF`. Every path that names the checkout — `package.json`, the
lockfile, `tsconfig.json` paths, `next.config.ts` aliases, the Tailwind
`@source` in `globals.css`, and `deploy.yml` — moves together.

## Alternatives rejected

- **Keep cloning into `deedlit.dev/`.** CI could set `path: deedlit.dev` and
  nothing here would change, but local clones would need a non-default
  directory name. Matching the repo name keeps the layout obvious.
- **Rely on GitHub's redirect from the old repo name.** It works for CI until
  the old name is reused, and does nothing for the local path.

## Consequences

- Existing local setups need the sibling at `../deedlit.dev.ui` and an
  `npm install` to relink `node_modules/@carneirofc/ui`.
- `DEEDLIT_REF` is unchanged; the sha exists in the renamed repo. Upstream has
  since moved to pnpm, so the next pin bump must recheck CI's
  `npm install --omit=dev` step for the UI's runtime deps.
