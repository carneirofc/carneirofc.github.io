# 12. The UI sibling's runtime deps are installed with pnpm

- **Status:** Accepted — supersedes ADR 0011's npm step for the sibling
- **Date:** 2026-11-14

## Context

ADR 0011 moved this repo to pnpm but kept one npm command in `deploy.yml`:
installing `@carneirofc/ui`'s runtime dependencies inside the sibling checkout.
At the pinned `DEEDLIT_REF` (`2e6f8ed`) the sibling was still an npm workspace
with a `package-lock.json`, and pnpm there would have resolved fresh, unpinned
versions. ADR 0011 recorded the follow-up: once `DEEDLIT_REF` moved past the
sibling's own pnpm migration, that step had to become a pnpm install using the
sibling's lockfile and pnpm version.

`deedlit.dev.ui` switched to pnpm in `594790c` (`packageManager: pnpm@11.28.4`,
`pnpm-lock.yaml`, no `package-lock.json`). `DEEDLIT_REF` now points past it.

## Decision

- Both jobs install the UI's runtime deps with
  `pnpm install --frozen-lockfile --prod --filter @carneirofc/ui`, run at the
  sibling's **root** (its workspace and lockfile live there, not in
  `deedlit.dev.ui/deedlit.dev.ui`).
- `--filter @carneirofc/ui` installs only that workspace package; `--prod`
  skips its devDependencies (Storybook, TypeScript, …). The result is the same
  four packages npm installed — `class-variance-authority`, `clsx`,
  `radix-ui`, `tailwind-merge` — symlinked into
  `deedlit.dev.ui/deedlit.dev.ui/node_modules`, where the UI source resolves
  them. The root's own devDependencies and `prepare` hook are not installed.
- No separate pnpm setup for the sibling. `pnpm/action-setup` installs this
  repo's pnpm (12.x); in the sibling, pnpm reads `packageManager` and switches
  to the pinned 11.28.4 by itself, so each lockfile is read by the pnpm that
  wrote it.
- `actions/setup-node`'s pnpm cache keys on both lockfiles.

## Alternatives rejected

- **Keep npm.** There is no `package-lock.json` past `594790c`; npm would
  resolve unpinned versions — the exact problem ADR 0011 avoided by keeping
  npm.
- **A full `pnpm install` of the sibling.** Pulls the comfyhelper app's and the
  root's dependencies, runs the root `prepare` hook, and installs devDeps the
  build never reads.
- **`file:` / a published `@carneirofc/ui`.** Out of scope; ADRs 0003 and 0011
  cover why the sibling stays a `link:`.

## Consequences

- Bumping `DEEDLIT_REF` is the whole procedure for adopting UI changes; the
  sibling's lockfile pins the UI's deps on both sides.
- Locally, run `pnpm install` once in the sibling checkout (a plain install is
  fine for development).
- If the sibling changes its pnpm version, nothing here changes: the switch
  follows its `packageManager`.
