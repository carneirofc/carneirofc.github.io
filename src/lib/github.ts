import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export const GITHUB_USER = "carneirofc";

// The subset of GET /users/{user}/repos the project cards read. Zod strips the
// rest of the (large) payload.
export const githubRepoSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  stargazers_count: z.number().int().nonnegative(),
  language: z.string().nullable(),
  pushed_at: z.iso.datetime(),
  archived: z.boolean(),
  fork: z.boolean(),
  private: z.boolean(),
});
export type GitHubRepo = z.infer<typeof githubRepoSchema>;

export const githubReposSchema = z.array(githubRepoSchema);

const REPO_HREF = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/;

/** Repo name for a plain `github.com/{owner}/{repo}` link; null for anything else. */
export function repoFromHref(href: string): string | null {
  const match = REPO_HREF.exec(href);
  return match && match[1] === GITHUB_USER ? (match[2] ?? null) : null;
}

const NEXT_LINK = /<([^>]+)>;\s*rel="next"/;
// The account has more than 100 public repos; cap the walk so a runaway Link
// header can't burn the rate limit.
const MAX_PAGES = 5;

async function fetchUserRepos(user: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let url: string | undefined =
    `https://api.github.com/users/${user}/repos?per_page=100&type=public`;
  for (let page = 0; url && page < MAX_PAGES; page++) {
    const res: Response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    repos.push(...githubReposSchema.parse(await res.json()));
    url = NEXT_LINK.exec(res.headers.get("link") ?? "")?.[1];
  }
  // Unauthenticated, the API only lists public repos already; filter anyway so
  // a token added later can never surface a private one.
  return repos.filter((repo) => !repo.private);
}

/**
 * One fetch for every card: the unauthenticated API allows 60 requests per
 * hour per IP, so cards share this query and pick their repo with `select`.
 */
export function githubReposQuery(user: string = GITHUB_USER) {
  return queryOptions({
    queryKey: ["github", "repos", user],
    queryFn: () => fetchUserRepos(user),
    staleTime: 10 * 60_000,
    retry: 1,
  });
}
