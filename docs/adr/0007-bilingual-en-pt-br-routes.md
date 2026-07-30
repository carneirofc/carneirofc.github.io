# 7. Bilingual site: English at the root, pt-BR mirrored under `/pt-br/`

- **Status:** Accepted
- **Date:** 2026-07-12

## Context

The site should read natively in both English and Brazilian Portuguese. Under
static export there is no middleware and no request-time negotiation, so every
locale variant has to be a real file in `out/`.

## Decision

English is served from the site root via the `(en)` route group; Portuguese
mirrors every route under `/pt-br/`. Each has its own layout rendering `<html>`
with the right `lang`, and each route file is a thin wrapper passing a `locale`
into a shared component in `src/components/pages/`.

Content locale is derived from the **filename**: `foo.mdx` is English,
`foo.pt-br.mdx` is Portuguese, and translations share the base slug. Velite's
transform turns that into `locale` / `slug` / `permalink`.

UI strings and the projects list are _code_, in `src/lib/i18n.ts`, as a typed
`Dictionary` per locale — so a missing string is a type error. Prose is
_content_, in `content/`.

`alternatePath()` maps a pathname to its counterpart by pure string transform,
which is what the header's language switch links to.

## Alternatives rejected

- **A `[locale]` dynamic segment.** The textbook shape, and it would avoid the
  duplicated route files. It also puts English on `/en/...` unless paired with
  a rewrite, and rewrites need a server. Keeping English at the bare root
  matters more than the duplication, which is a one-line wrapper per route.
- **Runtime locale detection / a client-side language context.** No server to
  negotiate with, and it would leave a single set of URLs — bad for sharing and
  for search engines. Distinct URLs per locale get real `hreflang` alternates.

## Consequences

- **Locale parity is a hard invariant.** The language switch is a pure path
  transform and both `[slug]` routes set `dynamicParams = false`, so a post
  published in only one language turns that switch into a 404.
  `scripts/check-translations.mjs` fails CI on any gap, in posts or in
  `content/about*.mdx`.
- Adding a route means adding it in both trees.
- Adding a _third_ locale would be the point to revisit the `[locale]` segment.
- `alternatePath()` has to preserve the trailing slash `trailingSlash: true`
  produces, in both directions.
