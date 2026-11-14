# carneirofc.github.io

Personal landing page + blog for **Cláudio Carneiro**, served at
[https://carneirofc.github.io/](https://carneirofc.github.io/).

Next.js static export (`output: "export"`) + [Velite](https://velite.js.org)
MDX content + the shared [`@carneirofc/ui`](https://github.com/carneirofc/deedlit.dev.ui/tree/master/deedlit.dev.ui)
design system, deployed to GitHub Pages via GitHub Actions.

This README is the how-to. See [`CONTEXT.md`](./CONTEXT.md) for what the system
is and the invariants it keeps, and [`docs/adr/`](./docs/adr/) for why each
piece was chosen.

## Prerequisites

- **Node 24+** and **pnpm** (the version pinned in `packageManager`).
- **A sibling checkout of `deedlit.dev.ui`** — `@carneirofc/ui` is consumed as a
  local `link:` dependency, so the repos must sit next to each other:

  ```
  <parent>/
  ├── carneirofc.github.io/   # this repo
  └── deedlit.dev.ui/         # git clone https://github.com/carneirofc/deedlit.dev.ui
      └── deedlit.dev.ui/
  ```

  Run `pnpm install` once in the sibling too: the UI source resolves its
  runtime deps (`radix-ui`, `cva`, …) from its own tree.

- **[exiftool](https://exiftool.org/)** — required by the pre-commit hook that
  strips metadata from images/videos (`pacman -S perl-image-exiftool`,
  `apt install libimage-exiftool-perl`, `brew install exiftool`).
- **[gitleaks](https://github.com/gitleaks/gitleaks)** _(optional locally)_ —
  the pre-commit secret scan warns and skips if it is missing; CI enforces it.

## Development

```sh
pnpm install        # also installs the Lefthook git hooks
pnpm run dev        # velite build + next dev
pnpm run build      # velite build + next build -> out/
pnpm run lint       # eslint
pnpm run typecheck  # tsc --noEmit (run `pnpm run velite` first on a fresh clone)
pnpm run format     # prettier --write
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

### Languages (en / pt-BR)

English lives at the site root; Brazilian Portuguese mirrors every route under
`/pt-br/`. Locale is derived from the filename: `foo.mdx` is English,
`foo.pt-br.mdx` is Portuguese, and translations share the base slug
(`hello-world.mdx` + `hello-world.pt-br.mdx` become `/blog/hello-world/` and
`/pt-br/blog/hello-world/`, cross-linked via hreflang). UI strings live in
`src/lib/i18n.ts`. Publish every post in **both** languages — the header
language switch maps paths 1:1, so a missing translation lands on a 404.

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

CI clones `deedlit.dev.ui` as a sibling directory, pinned to the `DEEDLIT_REF`
sha in `deploy.yml`, and installs the UI's runtime deps from the sibling's own
`pnpm-lock.yaml` (`pnpm install --frozen-lockfile --prod --filter
@carneirofc/ui`, ADR 0012). **To adopt UI changes:** pull `deedlit.dev.ui` and
update `DEEDLIT_REF` to the new sha. `pnpm-lock.yaml` here only records the
link, so it does not change (ADR 0011).

`codeql.yml` (SAST) and Dependabot (GitHub Actions updates only — Dependabot
cannot resolve the sibling `link:` dependency, so dependency bumps are manual)
round out the security tooling. GitHub's dependency graph does not read pnpm
12's two-document `pnpm-lock.yaml`, so Dependabot security _alerts_ do not fire
for npm packages either; run `pnpm audit` before releases (ADR 0011).

### One-time repo setup

GitHub Pages must be set to build from **GitHub Actions**:

```sh
gh api -X POST repos/carneirofc/carneirofc.github.io/pages -f build_type=workflow
```
