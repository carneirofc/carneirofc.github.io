# 1. Serve from a dedicated `<user>.github.io` repo at the domain root

- **Status:** Accepted
- **Date:** 2026-07-12

## Context

The site needed free hosting with a clean URL. A repo named exactly
`<user>.github.io` is the only free way to get GitHub Pages to serve at the
domain root with no path prefix.

## Decision

The site lives in its own repo, `carneirofc/carneirofc.github.io`, served at
`https://carneirofc.github.io/` with **no `basePath`**.

## Alternatives rejected

- **Build inside the profile repo `carneirofc/carneirofc`.** Its Pages URL
  would be the subpath `carneirofc.github.io/carneirofc/`, forcing a
  `basePath` — which reintroduces an entire class of static-export asset and
  link bugs. That repo is also "special" for a different reason (the profile
  README) and mixing the two purposes is confusing.
- **Custom domain via CNAME.** Also gets a root URL, but needs a domain and
  DNS. Deferred rather than rejected: adding a `CNAME` file later moves the
  site with no other code changes, precisely because there is no `basePath`.

## Consequences

- Every internal link and asset path is absolute from `/`. Nothing needs to
  know a prefix.
- The profile README in `carneirofc/carneirofc` is unrelated to this site.
- Adding a custom domain later is a one-file change.
