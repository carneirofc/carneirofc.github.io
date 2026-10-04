"use client";

import { useQuery } from "@tanstack/react-query";
import { LuCode, LuHistory, LuStar } from "react-icons/lu";
import { githubReposQuery } from "@/lib/github";
import { htmlLang, type Locale } from "@/lib/i18n";

const ICON = "h-3.5 w-3.5 shrink-0";

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

function relativeTime(iso: string, locale: Locale): string {
  const seconds = (Date.parse(iso) - Date.now()) / 1000;
  const format = new Intl.RelativeTimeFormat(htmlLang[locale], { numeric: "auto" });
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return format.format(0, "minute");
}

/**
 * Live stars, language and last push for one repo. Renders client-side only;
 * while loading or if GitHub is unreachable it keeps an empty row of the same
 * height, so the card never shifts and an outage degrades silently.
 */
export function RepoStats({
  repo,
  locale,
  labels,
}: {
  repo: string;
  locale: Locale;
  labels: { stars: string; updated: string };
}) {
  const { data } = useQuery({
    ...githubReposQuery(),
    select: (repos) => repos.find((r) => r.name === repo) ?? null,
  });

  return (
    <div className="cyber-muted flex min-h-5 flex-wrap items-center gap-x-4 gap-y-1 text-ui-xs">
      {data && (
        <>
          <span
            className="inline-flex items-center gap-1"
            aria-label={`${data.stargazers_count} ${labels.stars}`}
          >
            <LuStar aria-hidden className={ICON} />
            {data.stargazers_count}
          </span>
          {data.language && (
            <span className="inline-flex items-center gap-1">
              <LuCode aria-hidden className={ICON} />
              {data.language}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <LuHistory aria-hidden className={ICON} />
            {labels.updated} {relativeTime(data.pushed_at, locale)}
          </span>
        </>
      )}
    </div>
  );
}
