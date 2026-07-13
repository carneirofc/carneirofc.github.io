import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { SITE_URL } from "@/lib/metadata";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    ["/", "/about/", "/blog/", "/projects/", "/contact/"].map((route) => ({
      url: `${SITE_URL}${localePath(locale, route)}`,
      changeFrequency: "monthly" as const,
    })),
  );

  const postRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({
      url: `${SITE_URL}${post.permalink}`,
      lastModified: post.date,
    })),
  );

  const tagRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllTags(locale).map(({ tag }) => ({
      url: `${SITE_URL}${localePath(locale, `/blog/tags/${tag}/`)}`,
    })),
  );

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
