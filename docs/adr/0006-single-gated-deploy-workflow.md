# 6. One `deploy.yml` with gated jobs

- **Status:** Accepted
- **Date:** 2026-07-12

## Context

A solo repo that deploys on every push to `main`. A red check must block the
deploy — not merely report afterwards.

## Decision

A single `.github/workflows/deploy.yml` on push to `main`:

- **`checks`** — Velite, translation parity, Prettier, ESLint, `tsc`, and the
  media-metadata safety-net.
- **`gitleaks`** — full-history secret scan, in its own job so it can check out
  with `fetch-depth: 0` without slowing the rest.
- **`deploy`** — `needs: [checks, gitleaks]`; builds and publishes `out/` with
  `upload-pages-artifact` + `deploy-pages`.

Both `checks` and `deploy` check out this repo into `site/` and `deedlit.dev`
alongside it (see [ADR 0003](./0003-ui-via-sibling-file-dependency.md)).

Standalone `codeql.yml` (SAST) and `.github/dependabot.yml` round out the
security tooling.

Concurrency is `group: pages` with **`cancel-in-progress: false`**: a follow-up
push queues behind a running deploy rather than aborting one that may already be
inside `deploy-pages`, which would leave Pages half-updated.

## Alternatives rejected

- **Separate `ci.yml` + `deploy.yml`.** More conventional when external PRs
  matter, but it duplicates work and needs fiddlier cross-workflow gating
  (`workflow_run`) for a solo repo.
- **A `gh-pages` branch.** The artifact-based official Pages flow avoids a
  second branch of build output entirely.
- **Semgrep + Trivy/osv-scanner.** Largely duplicate CodeQL and Dependabot for a
  static site, and add PR noise.

## Consequences

- Fewest files, and the deploy is genuinely gated.
- Pages **Source** must be set to _GitHub Actions_ once, out of band — it cannot
  be expressed in committed code. `README.md` has the `gh api` command.
- Deploys are serialized. A burst of pushes lands one at a time.
