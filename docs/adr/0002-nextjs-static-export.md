# 2. Next.js with static export

- **Status:** Accepted
- **Date:** 2026-07-12

## Context

The site is a personal landing page plus an MDX blog, hosted on GitHub Pages —
so the output has to be plain static files. It also has to look like
`deedlit.dev`, which is a Next.js app built on the `@carneirofc/ui` design
system (React 19 + Tailwind 4).

## Decision

Next.js App Router with `output: "export"`, plus `trailingSlash: true` and
`images: { unoptimized: true }` (there is no server to run the image
optimizer).

## Alternatives rejected

- **Docusaurus.** Faster to scaffold a blog, but it ships its own Infima theme
  and MDX pipeline. Matching `@carneirofc/ui` would mean fighting and swizzling
  that theme, and the result would still read as a Docusaurus site rather than
  a sibling of `deedlit.dev`.

## Consequences

- `@carneirofc/ui` is reused directly, with the same mental model as
  `deedlit.dev` — the config delta is one line (`export` vs `standalone`).
- No server-side anything: no ISR, no route handlers at runtime, no image
  optimization. `robots.ts` and `sitemap.ts` are `dynamic = "force-static"`.
- Dynamic routes need `generateStaticParams`, and both `[slug]` routes set
  `dynamicParams = false` so an unknown path is a build-time absence rather
  than a runtime miss.
