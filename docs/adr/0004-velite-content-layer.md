# 4. Velite as the MDX content layer

- **Status:** Accepted
- **Date:** 2026-07-12

## Context

The blog needs MDX posts with frontmatter, a post index, tag pages, and drafts.
A malformed post should fail the build, not produce a broken deploy.

## Decision

Velite. Posts are `content/blog/*.mdx` with Zod-validated frontmatter; Velite
emits typed data into `.velite/`, which the app imports as `#site/content`
(mapped in `tsconfig.json`).

The schema carries two constraints worth calling out:

- Tags must match `/^[a-z0-9-]+$/`, so a tag is URL-safe by construction and
  maps 1:1 onto `/blog/tags/[tag]/`.
- A `transform` derives `locale`, `slug`, and `permalink` from the filename
  (see [ADR 0007](./0007-bilingual-en-pt-br-routes.md)).

## Alternatives rejected

- **`@next/mdx` alone.** Renders a file as a route, but gives no post index, no
  frontmatter validation, and no tag pages — all of which would then be
  hand-rolled.
- **`gray-matter` + `next-mdx-remote/rsc`.** Maximum control, but that means
  hand-writing the loader, the index, and the tag logic, with no validation.
- **Contentlayer.** Effectively unmaintained, with poor support for current
  Next versions.

## Consequences

- Velite must run before Next: `npm run build` is `velite build && next build`,
  and the same ordering applies to `dev`, to CI, and to the Lefthook typecheck
  hook. A fresh clone has no `.velite/`, so `tsc` fails until it is generated.
- `.velite/` and `public/static/` are generated and gitignored.
- Validation is per-document. Cross-document invariants — notably locale parity
  — need a separate check (`scripts/check-translations.mjs`).
