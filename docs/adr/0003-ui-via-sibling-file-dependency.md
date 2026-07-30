# 3. Consume `@carneirofc/ui` from a sibling checkout, not a package registry

- **Status:** Accepted — supersedes the original GitHub Packages decision
- **Date:** 2026-07-12

## Context

`@carneirofc/ui` is the React design system shared with `deedlit.dev`, where it
lives inside that repo's monorepo as `deedlit.dev.ui`. This site needs it, and
this site is a separate repo.

The original plan was to consume it from **GitHub Packages**
(`npm.pkg.github.com`), pinned by semver, authenticated with a `read:packages`
token — an `.npmrc` locally and `NODE_AUTH_TOKEN` in CI. In practice that added
a release ceremony (cut a `deedlit.dev` Release, then bump a version here)
before any UI change could be seen on this site, plus a token to manage in two
places, all for a single consumer of a package with one author.

## Decision

Depend on it as a local path: `"@carneirofc/ui":
"file:../deedlit.dev/deedlit.dev.ui"`, with `deedlit.dev` checked out as a
sibling directory. CI reproduces that layout by checking out both repos and
pinning `deedlit.dev` to the `DEEDLIT_REF` sha in `deploy.yml`.

Because npm does not install dependencies of linked packages, CI runs
`npm install --omit=dev` inside `deedlit.dev/deedlit.dev.ui` so the UI's own
runtime deps resolve from its tree. React must stay a single copy, so
`next.config.ts` aliases (webpack and turbopack) and `tsconfig.json` paths pin
`react`/`react-dom` to this repo's `node_modules`.

## Alternatives rejected

- **GitHub Packages, semver-pinned.** See above — release ceremony and token
  management for one consumer. This is what the decision supersedes.
- **Git submodule.** Submodules are whole-repo: it would vendor the entire
  `deedlit.dev` monorepo to get one package, and rebuild the UI on every site
  build.
- **Vendor/copy the components.** Instant drift from the source of truth.

## Consequences

- Iterating on the UI is immediate: edit it in the sibling checkout and the dev
  server picks it up. No publish step.
- Contributors need both repos side by side (documented in `README.md`).
- **Dependabot cannot bump npm here** — the sibling repo doesn't exist in its
  environment, so npm jobs always fail. `.github/dependabot.yml` covers
  `github-actions` only; npm bumps are manual, though GitHub security _alerts_
  still fire on the lockfile.
- Adopting UI changes is a two-part commit: refresh `package-lock.json` and
  bump `DEEDLIT_REF` to the new sha.
- The aliases point at the UI's **source**, not a built `dist/`, so
  `transpilePackages` and `experimental.externalDir` are load-bearing.
