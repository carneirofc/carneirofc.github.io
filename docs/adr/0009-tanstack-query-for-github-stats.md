# 9. TanStack Query for live GitHub stats

- **Status:** Accepted
- **Date:** 2026-10-04

## Context

The project cards list repos with a hand-written description and a link. Stars,
main language and last push go stale the moment they are written down, and the
site is a static export ([ADR 0002](./0002-nextjs-static-export.md)) with no
server to refresh them. [`AGENTS.md`](../../AGENTS.md) already said that if the
site ever fetches on the client, it uses TanStack Query with a Zod-parsed
response, and that adding it needs an ADR. This is that ADR.

## Decision

The browser fetches `GET https://api.github.com/users/carneirofc/repos` once
(two pages today, following the `Link` header, at most five),
through `@tanstack/react-query`. The response is parsed with
`githubReposSchema` (`src/lib/github.ts`), and each card picks its repo out of
the one shared query with `select`. A single `QueryClient` lives in
`src/components/providers.tsx`, so the cache survives client-side navigation;
`staleTime` is 10 minutes.

The stats are an enhancement, not content: the prerendered HTML has none, and
while loading or when GitHub is unreachable the row stays empty at a fixed
height. Only cards whose `href` is a plain `github.com/carneirofc/{repo}` link
get stats, and only public repos are shown: the request asks for
`type=public` and the result is filtered on `private: false`.

## Alternatives rejected

- **Fetch at build time.** No client JavaScript, but the numbers are only as
  fresh as the last deploy, and every build would depend on the GitHub API
  (rate limits included).
- **`useEffect` + `fetch`.** Forbidden by `AGENTS.md`: no caching, no dedupe
  across cards, and hand-rolled loading/error state.
- **One request per repo.** Ten cards would spend a sixth of the
  unauthenticated limit (60 requests per hour per IP) on every visit.

## Consequences

- A new runtime dependency, about 13 kB gzipped of client JavaScript.
- The site now makes one request to a third party (`api.github.com`) from the
  visitor's browser on pages that show project cards.
- Above the rate limit the stats simply don't render; nothing else breaks.
