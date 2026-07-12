# carneirofc.github.io — Implementation Plan

Personal landing page + blog for **Cláudio Carneiro**, served at
`https://carneirofc.github.io/`. Built with Next.js (static export) and the
shared `@carneirofc/ui` design system, deployed to GitHub Pages via GitHub
Actions.

This document is the authoritative plan. It captures every decision, its
rationale, the rejected alternatives, and a phased implementation checklist.

---

## 1. Goals

- Present myself (bio / about, skills, links).
- Publish blog posts authored in **MDX**.
- Link out to other projects (`deedlit.dev`, GitHub, etc.).
- Provide contact details.
- Keep the **look & feel** consistent with `deedlit.dev` by reusing the
  `@carneirofc/ui` component library.
- Ship as a **static build** hosted on **GitHub Pages**.
- Automate deployment, linting, static analysis, and security scanning via
  **GitHub Actions**.
- Enforce local quality + privacy gates with **git hooks**, including
  stripping metadata from committed images/videos so private information
  (GPS, device, timestamps) never leaks.

---

## 2. Decisions (with rationale)

Each row is a settled decision from the design review. "Rejected" lists the
alternatives considered and why they lost.

### 2.1 Hosting & URL

- **Decision:** Site lives in its **own repo** `carneirofc/carneirofc.github.io`,
  served at the **root** `https://carneirofc.github.io/`.
- **Why:** A repo literally named `<user>.github.io` is the only free way to
  get a root URL with **no `basePath`**, which eliminates an entire class of
  static-export asset/link bugs. The profile repo `carneirofc/carneirofc` is
  "special" only for the profile README — its Pages URL would be the ugly
  subpath `carneirofc.github.io/carneirofc/` and would require `basePath`.
- **Rejected:**
  - _Custom domain (CNAME) on the profile repo_ — root URL, but needs a domain
    - DNS; deferred (can be added later without breaking anything).
  - _Build inside `carneirofc/carneirofc`_ — forces `basePath`, conflicts with
    the profile README purpose.
- **Consequence:** The profile README in `carneirofc/carneirofc` stays as-is
  and is unrelated to this site.

### 2.2 Framework

- **Decision:** **Next.js** with **static export** (`output: 'export'`).
- **Why:** Direct reuse of `@carneirofc/ui` (React 19 + Tailwind 4) with the
  same mental model as `deedlit.dev` (one config delta: `export` vs
  `standalone`). Full control over layout/design.
- **Rejected:** _Docusaurus_ — ships its own Infima theme + MDX pipeline;
  matching the `@carneirofc/ui` design system means fighting/swizzling the
  theme. Faster blog scaffolding, but the result looks like Docusaurus, not
  like `deedlit.dev`.

### 2.3 Shared UI consumption

- **Decision:** Consume **`@carneirofc/ui` from GitHub Packages**
  (`npm.pkg.github.com`, `@carneirofc` scope), pinned by semver.
- **Why:** This is a separate repo, so `deedlit.dev`'s `file:../deedlit.dev.ui`
  trick cannot work in CI. The library already publishes to GitHub Packages via
  `deedlit.dev`'s `publish-ui.yml` on Release. Versioned + decoupled + lean.
- **Rejected:**
  - _Git submodule_ — submodules are whole-repo, so it would vendor the entire
    `deedlit.dev` monorepo for one package and rebuild UI on every site build.
  - _Vendor/copy components_ — instant drift from the source of truth.
- **Workflow to adopt new components:** cut a Release on `deedlit.dev` → bump
  `@carneirofc/ui` version here.
- **Auth:** requires a token with `read:packages`. `GITHUB_TOKEN` in CI; a PAT
  in `~/.npmrc` locally.

### 2.4 MDX content pipeline

- **Decision:** **Velite** content layer. Posts in `content/blog/*.mdx` with
  Zod-validated frontmatter; Velite generates a typed post array + tag index.
- **Why:** Gives typed, validated frontmatter (malformed post → build fails,
  not a broken deploy) and the post-list/tag boilerplate a blog needs — the
  same "free" structure Docusaurus would have provided. Static-export friendly
  (runs as a build step producing a data dir we import).
- **Rejected:**
  - _`@next/mdx` alone_ — renders a file as a route but gives no post index, no
    frontmatter validation, no tag pages.
  - _Manual `gray-matter` + `next-mdx-remote/rsc`_ — max control, but we'd
    hand-roll the loader/index/tag logic with no validation.
  - _Contentlayer_ — effectively unmaintained, poor Next 15/16 support.

### 2.5 Toolchain baseline

- **Package manager:** **npm** (matches `deedlit.dev` + `publish-ui.yml`).
- **Node:** **24**.
- **Styling:** **Tailwind 4** (`@tailwindcss/postcss`), mirroring `deedlit.dev`.

### 2.6 Git-hooks manager

- **Decision:** **Lefthook**.
- **Why:** Single fast binary (installable via npm), YAML config, parallel
  hooks, built-in staged-file glob filtering (replaces `lint-staged`), runs
  arbitrary commands cleanly — ideal for combining lint + the custom exiftool
  hook. Easy to reproduce in CI.
- **Rejected:**
  - _Husky_ — just a hook installer; needs `lint-staged` bolted on.
  - _pre-commit (Python)_ — pulls a Python runtime into a pure-JS repo.

### 2.7 Media metadata stripping

- **Decision:** **exiftool** strips metadata from staged **images and video**
  with `-all= -overwrite_original` (lossless, no re-encode). The hook
  **auto-fixes**: strips in place and **re-stages** via Lefthook's
  `stage_fixed`, so the clean file is what gets committed.
- **Image globs:** `jpg,jpeg,png,webp,heic,heif,tiff,gif`.
- **Video globs:** `mp4,mov,m4v,mkv,avi,webm`.
- **Why exiftool-only for video:** kills the privacy-relevant data (GPS,
  creation date, device/software) with no re-encode and a single dependency.
- **Rejected:** _exiftool + `ffmpeg -map_metadata -1` for video_ — more
  thorough (drops per-stream metadata) but adds a second binary and can alter
  the container.
- **Defense-in-depth:** a **CI safety-net** job fails the build if any committed
  media still carries GPS/EXIF, guarding against `git commit --no-verify`.
- **Local dependency:** `exiftool` must be installed; Lefthook will check for
  it and the README documents installation.

### 2.8 Quality & security tooling (Recommended tier)

- **Quality:** **ESLint** (`eslint-config-next`), **Prettier**,
  **`tsc --noEmit`**.
- **Secrets:** **Gitleaks** — Lefthook pre-commit hook **and** a CI job.
- **Dependencies:** **Dependabot** — automated dependency + security-alert PRs.
- **SAST:** **CodeQL** — GitHub-native, low-noise, catches DOM-XSS / unsafe
  patterns in client JS.
- **Rejected (Max tier):** Semgrep + Trivy/osv-scanner — largely duplicate
  CodeQL + Dependabot for a static site and add PR noise.

### 2.9 CI/CD topology

- **Decision:** Single **`deploy.yml`** with **gated jobs** (topology A):
  - **job `checks`** — ESLint, Prettier (check mode), `tsc`, Gitleaks, media
    metadata safety-net.
  - **job `deploy`** — `needs: checks`; builds (Velite + Next static export)
    and deploys via `actions/upload-pages-artifact` + `actions/deploy-pages`.
    A red check blocks the deploy.
  - Standalone **`codeql.yml`** and **`dependabot.yml`**.
- **Why:** Fewest files; deploy is genuinely gated; no `workflow_run` wiring.
- **Rejected:** _Separate `ci.yml` + `deploy.yml`_ — more conventional for
  external PRs but overlapping work + fiddlier cross-workflow gating for a solo
  repo.
- **Deploy method:** artifact-based official Pages flow (no `gh-pages` branch).
- **Package auth in CI:** `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` with
  `permissions: packages: read`. If cross-repo read of the public package is
  blocked, fall back to a `read:packages` PAT stored as a repo secret.

### 2.10 Manual / out-of-band steps

1. Set GitHub Pages **Source → GitHub Actions** in repo settings (via `gh` or
   the web UI — cannot be done purely in committed code).
2. Ensure `exiftool` is installed locally for the pre-commit hook.
3. (If needed) add a `read:packages` PAT secret for the UI package.

---

## 3. Information architecture

| Route              | Purpose                                                       |
| ------------------ | ------------------------------------------------------------- |
| `/`                | Home / about — bio, skills, primary links                     |
| `/blog`            | Post list (title, date, tags, excerpt), newest first          |
| `/blog/[slug]`     | Rendered MDX post                                             |
| `/blog/tags/[tag]` | Posts filtered by tag                                         |
| `/projects`        | Curated links to other projects (`deedlit.dev`, GitHub, etc.) |
| `/contact`         | Email, LinkedIn, GitHub, other channels                       |

Shared chrome (header, footer, theme toggle) reused from / styled after
`@carneirofc/ui`, consistent with `deedlit.dev`.

---

## 4. Proposed repository layout

```
carneirofc.github.io/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml           # checks (gate) -> build + deploy Pages
│   │   └── codeql.yml           # SAST
│   └── dependabot.yml           # dependency + security update PRs
├── content/
│   └── blog/
│       └── hello-world.mdx      # seed post
├── public/                      # static assets (favicon, images, CNAME later)
├── scripts/
│   └── check-media-metadata.mjs # CI safety-net: fail if GPS/EXIF present
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # home / about
│   │   ├── globals.css
│   │   ├── blog/
│   │   │   ├── page.tsx         # post list
│   │   │   ├── [slug]/page.tsx  # post
│   │   │   └── tags/[tag]/page.tsx
│   │   ├── projects/page.tsx
│   │   └── contact/page.tsx
│   ├── components/              # site-local components (chrome, MDX mapping)
│   └── lib/                     # post helpers over Velite output
├── .velite/                     # generated content (gitignored)
├── velite.config.ts             # blog collection + Zod schema
├── next.config.ts               # output: 'export', transpilePackages, MDX
├── postcss.config.js            # Tailwind 4
├── lefthook.yml                 # pre-commit: lint/format/typecheck + exiftool
├── .npmrc                       # @carneirofc -> npm.pkg.github.com
├── .gitleaks.toml               # (optional) gitleaks config/allowlist
├── .prettierrc / .prettierignore
├── .eslintrc / eslint.config.mjs
├── .editorconfig
├── tsconfig.json
├── package.json
├── package-lock.json
├── README.md                    # setup, exiftool requirement, dev commands
└── PLAN.md                      # this document
```

---

## 5. Key configuration sketches

> Illustrative — final versions pinned to current tool versions during
> implementation.

### 5.1 `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // static HTML for GitHub Pages
  reactStrictMode: true,
  transpilePackages: ["@carneirofc/ui"],
  images: { unoptimized: true }, // no server image optimizer under export
  // No basePath/assetPrefix needed: served at domain root.
};

export default nextConfig;
```

### 5.2 `.npmrc`

```
@carneirofc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

### 5.3 `velite.config.ts` (shape)

```ts
import { defineConfig, defineCollection, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s.object({
    title: s.string().max(120),
    date: s.isodate(),
    tags: s.array(s.string()).default([]),
    excerpt: s.string().optional(),
    draft: s.boolean().default(false),
    slug: s.path(),
    content: s.mdx(),
  }),
});

export default defineConfig({ collections: { posts } });
```

### 5.4 `lefthook.yml` (shape)

```yaml
pre-commit:
  parallel: true
  jobs:
    - name: lint-staged-code
      glob: "*.{ts,tsx,js,jsx,mjs,css,md,mdx,json}"
      run: |
        npx prettier --write {staged_files}
        npx eslint --fix {staged_files}
      stage_fixed: true
    - name: typecheck
      glob: "*.{ts,tsx}"
      run: npx tsc --noEmit
    - name: strip-media-metadata
      glob: "*.{jpg,jpeg,png,webp,heic,heif,tiff,gif,mp4,mov,m4v,mkv,avi,webm}"
      run: exiftool -all= -overwrite_original {staged_files}
      stage_fixed: true
    - name: gitleaks
      run: gitleaks protect --staged --redact --no-banner
```

### 5.5 `deploy.yml` (shape)

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  packages: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
          registry-url: https://npm.pkg.github.com
          scope: "@carneirofc"
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: npx prettier --check .
      - run: npx eslint .
      - run: npx tsc --noEmit
      - uses: gitleaks/gitleaks-action@v2
      - run: node scripts/check-media-metadata.mjs

  deploy:
    needs: checks
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
          registry-url: https://npm.pkg.github.com
          scope: "@carneirofc"
      - run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: npm run build # velite + next build (export -> out/)
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 5.6 `scripts/check-media-metadata.mjs` (behavior)

- Enumerate tracked media files (image/video globs).
- Run `exiftool -json -GPS* -Make -Model -Software -CreateDate` on each.
- Exit non-zero (fail the build) if any privacy-relevant tag is present.

---

## 6. Implementation phases

Each phase should end in a working, committed state.

### Phase 0 — Repo bootstrap

- [ ] `package.json` (npm, Node 24), `.npmrc`, `.gitignore`, `.editorconfig`,
      `tsconfig.json`, first commit on `main`.
- [ ] Configure local `~/.npmrc` PAT so `@carneirofc/ui` installs.

### Phase 1 — Next.js + UI + Tailwind

- [ ] Scaffold `src/app` with `layout.tsx`, `page.tsx`, `globals.css`.
- [ ] `next.config.ts` with `output: 'export'`, `transpilePackages`.
- [ ] Tailwind 4 via `@tailwindcss/postcss`; import `@carneirofc/ui` styles.
- [ ] Render a UI component to prove the design system loads.
- [ ] `npm run build` produces `out/` locally.

### Phase 2 — Content pipeline (Velite + MDX)

- [ ] `velite.config.ts` with the blog collection + Zod schema.
- [ ] Wire Velite into the build; `.velite/` gitignored.
- [ ] `src/lib` post helpers (list, by-slug, by-tag, sort, drafts filtered).
- [ ] Seed `content/blog/hello-world.mdx`.

### Phase 3 — Pages

- [ ] Home/about, `/blog`, `/blog/[slug]`, `/blog/tags/[tag]`, `/projects`,
      `/contact` with `generateStaticParams`.
- [ ] MDX component mapping (code blocks, headings) using `@carneirofc/ui`.
- [ ] Header/footer/theme chrome consistent with `deedlit.dev`.

### Phase 4 — Local guardrails (Lefthook)

- [ ] Add Lefthook; `lefthook install`.
- [ ] Pre-commit: prettier + eslint + tsc (staged), gitleaks, exiftool strip.
- [ ] Verify exiftool auto-strip + re-stage on a test image/video.

### Phase 5 — CI/CD & security

- [ ] `deploy.yml` (checks gate → build + deploy).
- [ ] `scripts/check-media-metadata.mjs` safety-net.
- [ ] `codeql.yml`, `.github/dependabot.yml`.
- [ ] Set Pages **Source → GitHub Actions**; verify first deploy.
- [ ] Confirm `GITHUB_TOKEN` reads the public UI package (else add PAT secret).

### Phase 6 — Content & polish

- [ ] Real bio, projects, contact content.
- [ ] `robots`, `sitemap`, favicon/manifest, OG metadata.
- [ ] First real blog post.

---

## 7. Open items / risks

- **Cross-repo package read:** `GITHUB_TOKEN` reading the public
  `@carneirofc/ui` may be blocked by org/package settings → fallback PAT.
- **exiftool availability:** required locally; missing binary should fail the
  hook loudly (documented in README).
- **exiftool + LFS/binary media:** confirm `stage_fixed` re-stages correctly
  for large media; document `--no-verify` is discouraged (CI net catches it).
- **Custom domain (future):** adding a `CNAME` + DNS later moves the site to a
  domain root with no code changes beyond the `CNAME` file.
- **UI version drift:** adopting new components requires a `deedlit.dev` Release
  - version bump here (intentional, decoupled cadence).

---

## 8. Decision log (quick reference)

| #   | Topic         | Decision                                                      |
| --- | ------------- | ------------------------------------------------------------- |
| 1   | Hosting       | Own repo `carneirofc.github.io`, root URL, no basePath        |
| 2   | Framework     | Next.js static export (`output: 'export'`)                    |
| 3   | UI reuse      | `@carneirofc/ui` from GitHub Packages, semver-pinned          |
| 4   | Content       | Velite + MDX, Zod-validated frontmatter                       |
| 5   | Toolchain     | npm, Node 24, Tailwind 4                                      |
| 6   | Git hooks     | Lefthook                                                      |
| 7   | Media privacy | exiftool strip (images + video) + re-stage; CI safety-net     |
| 8   | Quality/sec   | ESLint, Prettier, tsc, Gitleaks, Dependabot, CodeQL           |
| 9   | CI/CD         | Single `deploy.yml`, checks-gated deploy, official Pages flow |
