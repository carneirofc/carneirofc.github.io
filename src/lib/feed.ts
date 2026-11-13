import { getDictionary, htmlLang, localePath, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/metadata";
import { getAbout, getAllPosts } from "@/lib/posts";

// RSS 2.0 feed of one locale's posts, served at /feed.xml and /pt-br/feed.xml
// by the route handlers next to each root layout.

/** Feed path for a locale, e.g. "/pt-br/feed.xml". */
export function feedPath(locale: Locale): string {
  return localePath(locale, "/feed.xml");
}

/** Feed title, also used for the <link rel="alternate"> in every page's head. */
export function feedTitle(locale: Locale): string {
  return `${getAbout(locale).name} — ${getDictionary(locale).blog.title}`;
}

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const rfc822 = (date: string) => new Date(date).toUTCString();

export function buildFeed(locale: Locale): string {
  const t = getDictionary(locale);
  const posts = getAllPosts(locale);
  const blogUrl = `${SITE_URL}${localePath(locale, "/blog/")}`;

  const items = posts.map((post) => {
    const url = `${SITE_URL}${post.permalink}`;
    return [
      "    <item>",
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${url}</link>`,
      `      <guid isPermaLink="true">${url}</guid>`,
      `      <pubDate>${rfc822(post.date)}</pubDate>`,
      ...(post.excerpt ? [`      <description>${escapeXml(post.excerpt)}</description>`] : []),
      ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      "    </item>",
    ].join("\n");
  });

  // lastBuildDate is the newest post, not the build time, so an unchanged
  // feed stays byte-identical across deploys.
  const updated = posts[0] ? [`    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>`] : [];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(feedTitle(locale))}</title>`,
    `    <link>${blogUrl}</link>`,
    `    <description>${escapeXml(t.blog.description)}</description>`,
    `    <language>${htmlLang[locale]}</language>`,
    ...updated,
    `    <atom:link href="${SITE_URL}${feedPath(locale)}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

export function feedResponse(locale: Locale): Response {
  return new Response(buildFeed(locale), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
