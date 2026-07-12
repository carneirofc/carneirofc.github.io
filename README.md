# carneirofc.github.io

Personal landing page + blog for **Cláudio Carneiro**, served at
[https://carneirofc.github.io/](https://carneirofc.github.io/).

Next.js static export (`output: "export"`) + [Velite](https://velite.js.org)
MDX content + the shared [`@carneirofc/ui`](https://github.com/carneirofc/deedlit.dev/tree/master/deedlit.dev.ui)
design system, deployed to GitHub Pages via GitHub Actions. See
[`PLAN.md`](./PLAN.md) for the full design rationale.

## Prerequisites

- **Node 24+** and npm.
- **A sibling checkout of `deedlit.dev`** — `@carneirofc/ui` is consumed as a
  local `file:` dependency, so the repos must sit next to each other:

  ```
  <parent>/
  ├── carneirofc.github.io/   # this repo
  └── deedlit.dev/            # git clone https://github.com/carneirofc/deedlit.dev
      └── deedlit.dev.ui/
  ```

- **[exiftool](https://exiftool.org/)** — required by the pre-commit hook that
  strips metadata from images/videos (`pacman -S perl-image-exiftool`,
  `apt install libimage-exiftool-perl`, `brew install exiftool`).
- **[gitleaks](https://github.com/gitleaks/gitleaks)** _(optional locally)_ —
  the pre-commit secret scan warns and skips if it is missing; CI enforces it.

## Development

```sh
npm install        # also installs the Lefthook git hooks
npm run dev        # velite build + next dev
npm run build      # velite build + next build -> out/
npm run lint       # eslint
npm run typecheck  # tsc --noEmit (run `npm run velite` first on a fresh clone)
npm run format     # prettier --write
```

## Writing content

- **Blog posts** live in `content/blog/*.mdx`. Frontmatter is Zod-validated by
  Velite (`velite.config.ts`) — a malformed post fails the build:

  ```yaml
  ---
  title: Post title # required, ≤120 chars
  date: 2026-07-12 # required, ISO date
  tags: [platform, devsecops] # optional, lowercase slugs
  excerpt: One-liner shown in lists.
  draft: true # optional, hides the post
  ---
  ```

- **The about/home page** is driven by `content/about.mdx` (bio, role, links,
  skills).

## Git hooks (Lefthook)

`pre-commit` runs Prettier, ESLint, `tsc`, a gitleaks scan, and **strips all
metadata from staged media** (`exiftool -all= -overwrite_original`), re-staging
the clean files. Bypassing with `--no-verify` is discouraged: CI runs
`scripts/check-media-metadata.mjs`, which fails the build if any tracked media
still carries GPS/device/timestamp tags.

## CI/CD

`.github/workflows/deploy.yml` runs on pushes to `main`:

1. **checks** — ESLint, Prettier, `tsc`, media-metadata safety-net.
2. **gitleaks** — full-history secret scan.
3. **deploy** — gated on both; builds and publishes `out/` to GitHub Pages.

CI clones `deedlit.dev` as a sibling directory, pinned to the `DEEDLIT_REF`
sha in `deploy.yml`. **To adopt UI changes:** pull `deedlit.dev`, run
`npm install` here (refreshes `package-lock.json`), update `DEEDLIT_REF` to the
new sha, and commit both.

`codeql.yml` (SAST) and Dependabot round out the security tooling.

### One-time repo setup

GitHub Pages must be set to build from **GitHub Actions**:

```sh
gh api -X POST repos/carneirofc/carneirofc.github.io/pages -f build_type=workflow
```
