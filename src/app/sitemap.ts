import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const dynamic = "force-static";

const BASE_URL = "https://carneirofc.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = ["/", "/blog/", "/projects/", "/contact/"].map(
    (route) => ({
      url: `${BASE_URL}${route}`,
      changeFrequency: "monthly",
    }),
  );

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE_URL}${post.permalink}`,
    lastModified: post.date,
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: `${BASE_URL}/blog/tags/${tag}/`,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
