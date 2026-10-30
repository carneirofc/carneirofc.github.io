# 11. pnpm, with `@carneirofc/ui` as a `link:` dependency

- **Status:** Accepted — supersedes the npm specifics of ADRs 0003 and 0010
- **Date:** 2026-10-30

## Context

The repo was installed with npm. `deedlit.dev.ui`, the sibling it takes
`@carneirofc/ui` from, has moved to pnpm, and this repo follows so both sides
of the link use the same tool.

npm installed the `file:../deedlit.dev.ui/deedlit.dev.ui` directory dependency
as a **symlink** (`"link": true` in `package-lock.json`) and installed none of
its dependencies. pnpm splits those meanings: `file:` on a directory is a
hard-linked **copy** in its store, with the package's dependencies resolved
into this repo's lockfile, while `link:` is a plain symlink that, like npm,
installs none of them.

## Decision

- `"packageManager": "pnpm@12.15.0"`; `pnpm-lock.yaml` was generated with
  `pnpm import` from the npm lockfile and resolves the same 619 package
  versions. `package-lock.json` is gone.
- The dependency is `"link:../deedlit.dev.ui/deedlit.dev.ui"`. That is what
  ADR 0003 chose the sibling checkout for: an edit in `deedlit.dev.ui` shows
  up here with no reinstall. The UI keeps resolving its own runtime deps from
  its own tree, and the `next.config.ts` aliases and `tsconfig.json` paths
  still point at its source.
- Dependency build scripts are blocked unless listed in `allowBuilds`
  (`pnpm-workspace.yaml`): `esbuild` (Velite's bundler) and `lefthook` (its
  postinstall installs the git hooks) run. `sharp` and `unrs-resolver` are
  denied: both ship prebuilt binaries as optional dependencies, and their
  scripts are only a build-from-source fallback.
- CI installs with `pnpm/action-setup` (version from `site/package.json`),
  `actions/setup-node` with `cache: pnpm`, and `pnpm install --frozen-lockfile`.
  The step that installs the UI's runtime deps stays
  `npm install --omit=dev`: at `DEEDLIT_REF` the sibling is still an npm
  workspace with its own `package-lock.json`. pnpm there would ignore that
  lockfile and resolve fresh versions.

## Alternatives rejected

- **`file:` under pnpm.** A copy goes stale until the next install, so UI edits
  stop showing up. It also resolves the UI's deps into this lockfile at
  whatever versions are current: `pnpm import` picked `radix-ui` 1.8.1, while
  the sibling pins 1.6.7 at `DEEDLIT_REF`. Those copies would go unused anyway,
  because the aliases compile the sibling's source, which resolves its imports
  from the sibling's tree.
- **`node-linker=hoisted` / `shamefully-hoist`.** Not needed: lint, typecheck
  and the build pass on pnpm's default isolated layout.
- **pnpm for the sibling's runtime-deps step now.** That would mean an unpinned
  resolution of an npm project; see above.

## Consequences

- Commands are `pnpm …` (`README.md`). The hook runs `pnpm exec`.
- `pnpm-lock.yaml` records only the link, not the UI's contents or deps.
  Adopting UI changes no longer touches the lockfile here; bump `DEEDLIT_REF`.
- Once `DEEDLIT_REF` moves past upstream's pnpm migration, the runtime-deps
  step in `deploy.yml` must become a pnpm install at the sibling's root, using
  its `pnpm-lock.yaml` and its own pinned pnpm version, not this repo's.
- A new dependency with an install script does not run it until someone adds it
  to `allowBuilds`, deliberately.
- Dependabot's `npm` ecosystem also covers `pnpm-lock.yaml`. It stays off for
  the reason in ADR 0003: it cannot resolve the sibling.
- **Security alerts are lost.** Pinning the pnpm version makes pnpm 12 write
  `pnpm-lock.yaml` as two YAML documents, and GitHub's dependency graph does
  not read that format, so Dependabot alerts stop for npm packages and existing
  ones may close. ADR 0003 counted on those alerts. Until GitHub supports the
  format, `pnpm audit` run by hand is the only dependency vulnerability check.
