# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Footer: a second row with the RSS feed, a link to this site's source, and
  the language switch; the copyright line gets its `©`.
- Social cards: a 1200×630 PNG per page and post (`/og/<locale>/…/card.png`),
  rendered at build time by one route handler from the registry in
  `src/lib/og.ts`, in the site's dark palette with Sora and IBM Plex Mono
  (vendored WOFF, OFL, in `assets/fonts/`). `og:image` and `twitter:image` point
  at them, and the Twitter card is now `summary_large_image`.
- RSS 2.0 feeds per locale at `/feed.xml` and `/pt-br/feed.xml`, advertised with
  `<link rel="alternate" type="application/rss+xml">` on every page.
  `lastBuildDate` is the newest post's date, so an unchanged feed stays
  byte-identical across deploys.
- `BlogPosting` JSON-LD carries the post's card as `image`.
- schema.org JSON-LD: `WebSite` + `Person` on the home page, a `ProfilePage`
  on About and `BlogPosting` on posts, all pointing at one `Person` `@id`
  (`src/lib/structured-data.ts`).
- `x-default` hreflang on every page and hreflang alternates in the sitemap.
- Icons beyond the SVG: `favicon.ico` (16/32/48), a full-bleed 180px
  `apple-icon.png`, and a `manifest.webmanifest` with 192/512px PNGs.
- A skip-to-content link as the first tab stop, and an `aria-label` on the
  header nav.
- Three entries on the projects page (en and pt-br): ComfyHelper (the
  image library in `deedlit.dev.ui`, with its docs), `linux-diagnostics`, and
  the Next.js template for LLM-assisted development.
- A styled 404 page: `src/app/global-not-found.tsx` renders inside the site
  shell (header, footer, theme, `noindex`) instead of Next's bare default.
- `AGENTS.md`: the rules for changing this repo — Zod schemas for every data
  shape, no `any`, TanStack Query if client-side fetching is ever needed — and
  ADR 0008 recording the Zod decision. `CLAUDE.md` imports it.
- `zod` as a direct dependency.
- Live GitHub stats (stars, language, last push) on the project cards, fetched
  once in the browser with `@tanstack/react-query` and parsed with Zod. Public
  repos only. ADR 0009 records the decision.

- Baserow FOSS on the projects page (en and pt-br): my MIT-only fork of
  Baserow, with the premium and enterprise editions, the AI code paths, and the
  telemetry removed.
- Two entries on the projects page (en and pt-br): `devops-utils` (with a link
  to its docs) and Local LLM Translate (with a link to its Firefox add-on
  listing).
- `scripts/check-translations.mjs`, run in the CI checks job: a post published
  in only one language made the header's language switch a hard 404, and
  nothing caught it. Velite validates one document at a time, so locale parity
  needs its own gate. It also covers `content/about*.mdx`.
- `CONTEXT.md` and `docs/adr/`, replacing `PLAN.md` — see Changed/Removed.

### Changed

- `twitter:title`/`twitter:description` follow each page, like `og:*` already
  did, instead of repeating the home page's on every route.
- The home page title carries the role — `Cláudio Ferreira Carneiro — DevSecOps
& Platform Engineer` — from a new `site.tagline` dictionary string.
- About has its own meta description (`about.description`) instead of reusing
  the home page's headline.
- Sitemap: `lastmod` only where it is true (posts, and the newest post on the
  pages that list them); `changefreq` dropped, since Google ignores it.
- The repo is installed with pnpm 12 (`packageManager` pin) instead of npm;
  `pnpm-lock.yaml`, imported from `package-lock.json`, resolves the same
  versions. `@carneirofc/ui` is a `link:` dependency, so it is still a symlink
  to the sibling checkout. Dependency build scripts are allow-listed in
  `pnpm-workspace.yaml`. CI, the Lefthook hooks and the docs use pnpm. ADR
  0011 records the decision.
- `@carneirofc/ui` is now `file:../deedlit.dev.ui/deedlit.dev.ui`, following
  the rename of the `deedlit.dev` repo to `deedlit.dev.ui`; CI checks out the
  renamed repo into `deedlit.dev.ui/` at the same `DEEDLIT_REF`. ADR 0010
  records it.
- Projects page: the Baserow fork is now Saveroom, linking to the renamed
  repo and its docs; the deedlit.dev card points to `deedlit.dev.portal`,
  where the public site now lives.
- CI builds against `deedlit.dev` at `2e6f8ed` (was `4ac0b56`), matching the
  `@carneirofc/ui` package.json the lockfile records: radix-ui 1.6.7 and
  tailwind-merge 3.7. No UI source changes.
- Dependencies bumped to their latest compatible releases: Next 16.4, React
  19.3, Tailwind 4.3.3, tailwind-merge 3.7, eslint-config-next 16.4, lefthook
  2.2, postcss 8.5.29, prettier 3.9.9 and the React types. Held back: ESLint
  10 (the React, import and jsx-a11y plugins bundled by `eslint-config-next`
  still cap at ESLint 9), TypeScript 7 (`typescript-eslint` supports
  <6.1), and `@types/node` 26 (CI runs Node 24).
- Chevrons come from `react-icons/lu` like every other icon; the
  hand-written `icons.tsx` is gone. The home/about intro, the tag-chip list,
  `MetaDot` and the layouts' `viewport` are each defined once
  (`ProfileIntro`, `TagLinks`, `meta-dot.tsx`, `siteViewport`).
- The home page's projects section shows only entries marked `featured`
  (four today) instead of repeating the whole projects page.
- The language switch's labels moved into the dictionaries (`localeSwitch`)
  instead of being hard-coded in the component, and the link carries
  `hreflang`.
- The theme cookie's name and values live in `src/lib/theme.ts`; the inline
  init script and the toggle both build their pattern from it instead of
  repeating it.
- `getAbout()` no longer falls back to the English about page: a missing
  translation fails the build instead of shipping English under `/pt-br/`.
- GitHub Actions bumped to their Node 24 majors (`checkout` v7, `setup-node`
  v7, `gitleaks-action` v3, `configure-pages` v6, `upload-pages-artifact` v5,
  `deploy-pages` v5, `codeql-action` v4). GitHub-hosted runners dropped
  Node 20 on 2026-09-16.
- CI runs on `ubuntu-26.04`, pinned, instead of `ubuntu-latest`, ahead of
  that label's move to 26.04 (2026-10-19 to 2026-11-19).

- `ProjectEntry` and `Dictionary` are derived from Zod schemas, and the
  dictionaries are parsed at module load: a project with a bad URL, or a docs
  link without a label, now fails the build.
- The theme cookie and the JSON the check scripts read are parsed with Zod
  instead of being cast or trusted.
- `@typescript-eslint/no-explicit-any` is an error instead of a warning.
  `@next/next/no-head-element` is off: it is a Pages Router rule that
  misfired on the root layout's `<head>` in `SiteShell`.

- Design-audit fixes across the app layer (the shared `@carneirofc/ui` package
  is untouched): the app no longer defines its own violet accent — `--color-accent`,
  prose links, and the shared focus ring now come from the UI system's
  `--accent-cyan` / `--ui-ring-focus`; the contact page's three equal cards are
  replaced by an email-dominant panel with inline GitHub/LinkedIn links; header
  nav links pick up the mono `//` motif from the page eyebrows; section labels
  on home/about are real headings instead of uppercase eyebrows; the
  per-section scroll-reveal animation is gone (the section rail keeps the one
  entrance); buttons show the focus outline instantly and carry a single hover
  signal per variant; GitHub/LinkedIn glyphs use Lucide so all icons share one
  stroke voice.
- The home page's projects section lists every project instead of the first
  four. The section header still links to `/projects/`.
- Documentation is now split by question. `README.md` stays the how-to,
  `CONTEXT.md` describes what the system is and the invariants it keeps, and
  `docs/adr/` holds one record per decision with its rejected alternatives.
  ADR 0003 supersedes the original "consume `@carneirofc/ui` from GitHub
  Packages" decision with the sibling `file:` checkout that is actually in use.
- The Pages deploy no longer cancels itself: `deploy.yml`'s concurrency group
  uses `cancel-in-progress: false`, so a follow-up push queues behind a running
  deploy instead of aborting one that may already be inside `deploy-pages` and
  leaving Pages half-updated.
- The Lefthook `typecheck` job runs `velite build` first. `#site/content`
  resolves to `.velite/`, which doesn't exist on a fresh clone, so the first
  commit after cloning used to fail the hook.

### Fixed

- The header no longer overflows on phones: below `md` the nav takes its own
  row (the wordmark stands in for `//home`), and the header only turns sticky
  from `md`. The first row is sized so the floating theme toggle sits centred on
  it, and the locale switch keeps clear of the toggle until `lg`.
- The locale switch's accessible name now starts with its visible label
  (`PT-BR — Ler em português`), fixing Lighthouse's label-content-name-mismatch
  audit.
- The separator dot between location and role no longer dangles at the end of
  the line on narrow screens; the two stack below `sm`.
- The "about page" link in the first post pointed at `/` (and `/pt-br/`); it
  now points at the about page.
- The ICALEPCS 2019 paper link downloaded the whole 75 MB proceedings PDF; it
  now resolves the paper's DOI.
- The deedlit.dev and `@carneirofc/ui` project cards (en and pt-br) linked to
  `carneirofc.github.io/deedlit.dev/`, which 404s since the repo was renamed
  to `deedlit.dev.ui`. Docs, Storybook and source links now use the new name.
- Screen readers now hear the project cards' star count with its label: the
  `aria-label` on a plain `<span>` was ignored, so it is visually hidden
  text instead.
- The client bundle no longer ships every UI string. The locale helpers
  client components need moved to `src/lib/locale.ts` (re-exported from
  `i18n.ts`), so the dictionaries and their module-load parse stay on the
  server.
- The home page's section rail no longer links to `#posts` when there are
  no posts to show.
- The body's display-font class compiled to `font-weight` instead of
  `font-family`; it now uses Tailwind's typed `font-(family-name:…)` form.
- Every page now sends its own Open Graph `url`, `title` and `siteName`.
  About, blog, projects, contact and tag pages used to inherit the home
  page's `og:url` and title, and posts dropped `siteName`.
- The section nav's icon key was typed as `string`, so a misspelt icon
  type-checked and then crashed at render. The icon map now uses `satisfies`.
- On phones the body gradient stopped after the first viewport, leaving the
  footer on a white background. The deployed build predated the UI package's
  touch fallback (`background-attachment: scroll` on coarse pointers), so
  `DEEDLIT_REF` now points at a UI commit that includes it plus an `html`
  background-color safety net for overscroll.
- The language switch on the home page linked to `/pt-br` without the trailing
  slash the static export emits, costing a redirect hop. `alternatePath()` now
  keeps the slash in both directions.
- `src/app/.next/trace` and `trace-build` were committed: `.gitignore`'s
  `/.next/` is root-anchored and didn't match a nested copy left by a stray
  `next dev`. The rule is now unanchored and the files are untracked.
- `src/components/section-nav.tsx`'s docstring still described the smooth-scroll
  and active-section tracking that was removed with the JS island.
- `robots.ts` hardcoded the site origin instead of importing `SITE_URL`, and
  `globals.css` registered the UI source tree twice.

### Removed

- The section rail on the home page (three short sections didn't need one; it
  floated in empty margin) and its `home.sections*` dictionary strings. About
  keeps its rail.
- The Alyssa card from the projects page: its repo is private, so the
  link was a 404 for visitors.
- The cloud/container certification bullets (Docker DCA track, Amazon EKS and
  GKE, Google Cloud fundamentals, Linux Essentials and Ansible) from the
  education section of the about page, in both locales; the heading is now
  just "Education" / "Formação".
- The section-nav rail's custom JS island (rAF smooth-scroll, click
  handling, `IntersectionObserver` active-section tracking, sliding
  indicator bar): the active-item selection wasn't tracking scroll
  position correctly. Links are now plain anchors relying on native
  `scroll-behavior: smooth` and `scroll-margin-top`.

### Security

- `next` 16.4.0 → 16.4.6 (and `eslint-config-next` to match): fixes two
  critical RCEs (GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr) and a Server Actions
  DoS (GHSA-p3m5-59mp-jv5r). The static export ships neither the image
  optimizer nor server functions, so the exposure was the local dev server —
  but `next build` had also started aborting every other run with an upgrade
  nudge. `zod` 4.6.5 → 4.6.7 (GHSA-mrhx-c7xc-m3w5).
- Transitive fixes: `browserslist`, `baseline-browser-mapping`,
  `brace-expansion`, `js-yaml` and `minimatch` refreshed within their ranges.
  Two `pnpm-workspace.yaml` overrides where the parent pins a vulnerable range:
  `velite>sharp` → ^0.35.5 (libvips/libheif/librsvg CVEs; Velite's
  `metadata()`/`resize().webp()` calls are unchanged in 0.35) and
  `@tailwindcss/typography>postcss-selector-parser` → ^6.1.6.
- Accepted: `minimatch` 10 under `typescript-eslint` (GHSA-g3hv-75wg-m249,
  moderate, fixed only in 11). Lint-time only, fed globs from this repo's own
  config; even the latest `typescript-estree` still asks for ^10. `pnpm audit`
  goes from 24 findings (2 critical) to this one.

## [0.3.0] - 2026-07-14

### Added

- Documentation links on project cards for the projects that publish GitHub
  Pages (`deedlit.dev` docs, `@carneirofc/ui` Storybook, Qt Task Manager docs),
  rendered as a second accent button beside the source link.
- New "Web & Frameworks" skill group on the about page (Next.js, React, Node.js,
  Express, FastAPI).

### Changed

- Expanded the about-page skill tags: Docker Swarm, Ansible, Terraform, and
  EPICS Control System (platform); GitHub Actions (DevSecOps); Azure Data
  Factory and Confluent Kafka (data & AI).

## [0.2.0] - 2026-07-14

### Added

- Scroll-reveal animation for page sections as they enter the viewport, using
  CSS scroll-driven timelines with an `@supports` fallback and a
  `prefers-reduced-motion` guard.
- Motion for the left section-nav rail: a sliding accent indicator that tracks
  the active section, hover lift on the buttons, and a staggered entrance.

### Fixed

- Defined the previously no-op `.section-anchor` class so native `#hash` /
  `:target` navigation lands clear of the sticky header (`scroll-margin-top`).

[Unreleased]: https://github.com/carneirofc/carneirofc.github.io/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/carneirofc/carneirofc.github.io/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/carneirofc/carneirofc.github.io/releases/tag/v0.2.0
