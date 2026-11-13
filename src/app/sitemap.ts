import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n";
import { getAllPosts, getAllTags, getPostsByTag, getTranslation, type Post } from "@/lib/posts";
import { SITE_URL, languageAlternates } from "@/lib/metadata";

export const dynamic = "force-static";

const absolute = (path: string) => `${SITE_URL}${path}`;

/** hreflang alternates as absolute URLs, for a route in both locales. */
const alternates = (path: string) => ({
  languages: Object.fromEntries(
    Object.entries(languageAlternates(path)).map(([lang, href]) => [lang, absolute(href)]),
  ),
});

/** Newest post date in a list, or nothing for an empty list. */
const newest = (posts: Post[]) => posts[0]?.date;

// `lastModified` is only set where it is true: a post's date, and — for the
// pages that list posts — the newest post they show. The about/projects/contact
// pages have no reliable date, and a lastmod that is always "now" teaches
// crawlers to ignore it. `changeFrequency` is gone: Google ignores it.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const latest = newest(getAllPosts(locale));
    return [
      { route: "/", lastModified: latest },
      { route: "/about/" },
      { route: "/blog/", lastModified: latest },
      { route: "/projects/" },
      { route: "/contact/" },
    ].map(({ route, lastModified }) => ({
      url: absolute(localePath(locale, route)),
      ...(lastModified && { lastModified }),
      alternates: alternates(route),
    }));
  });

  const postRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      url: absolute(post.permalink),
      lastModified: post.date,
      ...(getTranslation(post) && { alternates: alternates(`/blog/${post.slug}/`) }),
    })),
  );

  const tagRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllTags(locale).map(({ tag }) => ({
      url: absolute(localePath(locale, `/blog/tags/${tag}/`)),
      lastModified: newest(getPostsByTag(locale, tag)),
    })),
  );

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
