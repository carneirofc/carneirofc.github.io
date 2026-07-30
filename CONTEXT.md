# Context

Personal landing page + blog for Cláudio Carneiro, served at
`https://carneirofc.github.io/`. Static site, no backend, no analytics.

Setup and day-to-day commands live in [`README.md`](./README.md). This file
covers what the system _is_ and the rules it has to keep. The reasoning behind
each choice — including the alternatives that lost — is in
[`docs/adr/`](./docs/adr/).

## Architecture

| Piece         | Choice                                              | ADR                                                            |
| ------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| Hosting       | GitHub Pages from `carneirofc/carneirofc.github.io` | [0001](./docs/adr/0001-own-repo-root-url.md)                   |
| Framework     | Next.js App Router, `output: "export"`              | [0002](./docs/adr/0002-nextjs-static-export.md)                |
| Design system | `@carneirofc/ui`, sibling `file:` checkout          | [0003](./docs/adr/0003-ui-via-sibling-file-dependency.md)      |
| Content       | Velite → MDX with Zod-validated frontmatter         | [0004](./docs/adr/0004-velite-content-layer.md)                |
| Local gates   | Lefthook + exiftool + gitleaks                      | [0005](./docs/adr/0005-lefthook-and-exiftool-privacy-gates.md) |
| CI/CD         | One `deploy.yml`, checks-gated                      | [0006](./docs/adr/0006-single-gated-deploy-workflow.md)        |
| Languages     | en at the root, pt-BR mirrored under `/pt-br/`      | [0007](./docs/adr/0007-bilingual-en-pt-br-routes.md)           |

Build order is always **Velite first, Next second** (`npm run build`): the app
imports `#site/content` → `.velite/`, which does not exist until Velite runs.

## Routes

Every route exists in both locales. English is at the site root (the `(en)`
route group); Brazilian Portuguese mirrors it under `/pt-br/`.

| English             | Portuguese                | Source                                      |
| ------------------- | ------------------------- | ------------------------------------------- |
| `/`                 | `/pt-br/`                 | home — bio, latest posts, featured projects |
| `/about/`           | `/pt-br/about/`           | driven by `content/about*.mdx`              |
| `/blog/`            | `/pt-br/blog/`            | post index                                  |
| `/blog/[slug]/`     | `/pt-br/blog/[slug]/`     | `content/blog/*.mdx`                        |
| `/blog/tags/[tag]/` | `/pt-br/blog/tags/[tag]/` | derived from post frontmatter               |
| `/projects/`        | `/pt-br/projects/`        | entries live in `src/lib/i18n.ts`           |
| `/contact/`         | `/pt-br/contact/`         | —                                           |

Page bodies are shared: each route file is a thin wrapper that passes a
`locale` into a component in `src/components/pages/`.

## Invariants

These are enforced by tooling, not by discipline. Breaking one fails the build.

- **Locale parity.** Every published post exists in both languages, and both
  `content/about*.mdx` files exist. The header's language switch is a pure path
  transformation and `dynamicParams = false`, so a one-language post makes that
  switch a 404. `scripts/check-translations.mjs` fails CI on a gap.
- **Trailing slashes.** `trailingSlash: true`. Every internal link — including
  the ones `alternatePath()` computes — ends in `/`.
- **No `basePath`.** The site is served from the domain root; asset and link
  paths are absolute. This is why the repo is named `<user>.github.io`.
- **No metadata in committed media.** Pre-commit strips it with exiftool;
  `scripts/check-media-metadata.mjs` fails CI if anything slips through
  (`--no-verify` doesn't get you past it).
- **Tags are URL-safe by construction.** The Velite schema requires
  `/^[a-z0-9-]+$/`, so a tag maps 1:1 onto `/blog/tags/[tag]/`.
- **Fonts are self-hosted.** `next/font` loads Sora and IBM Plex Mono; a postcss
  plugin strips the `fonts.gstatic.com` `@font-face` fallbacks that
  `@carneirofc/ui` ships. Nothing is fetched from Google at runtime.

## Content model

Locale is derived from the filename: `foo.mdx` is English, `foo.pt-br.mdx` is
Portuguese, and translations share the base slug. Velite's transform turns that
into `locale`, `slug`, and `permalink` fields.

UI strings and the projects list are code, not content — they live in
`src/lib/i18n.ts` as a typed `Dictionary` per locale. Prose (bio, posts) is
content, in `content/`.

## Known constraints

- **The UI dependency needs a sibling checkout.** `@carneirofc/ui` is
  `file:../deedlit.dev/deedlit.dev.ui`; CI clones `deedlit.dev` at the
  `DEEDLIT_REF` sha pinned in `deploy.yml`. Adopting UI changes means bumping
  that sha and `package-lock.json` together. See ADR 0003.
- **Dependabot cannot bump npm here** — it can't resolve the `file:` dep — so
  npm updates are manual. GitHub security _alerts_ still fire on the lockfile.
- **The section-nav rail has no active-section tracking.** The JS island that
  did it was removed; the links are plain anchors on native smooth scrolling.
