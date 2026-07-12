import { defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(120),
      date: s.isodate(),
      // Lowercase slug-style tags so they map 1:1 to /blog/tags/[tag] URLs.
      tags: s.array(s.string().regex(/^[a-z0-9-]+$/)).default([]),
      excerpt: s.string().optional(),
      draft: s.boolean().default(false),
      path: s.path(),
      metadata: s.metadata(),
      content: s.mdx(),
    })
    .transform((data) => {
      const slug = data.path.replace(/^blog\//, "");
      return { ...data, slug, permalink: `/blog/${slug}/` };
    }),
});

const about = defineCollection({
  name: "About",
  pattern: "about.mdx",
  single: true,
  schema: s.object({
    title: s.string(),
    name: s.string(),
    role: s.string(),
    headline: s.string(),
    location: s.string(),
    email: s.string(),
    links: s.object({
      github: s.string().url(),
      linkedin: s.string().url(),
      projects: s.string().url(),
    }),
    skills: s.object({
      languages: s.array(s.string()),
      platform: s.array(s.string()),
      devsecops: s.array(s.string()),
      cloud: s.array(s.string()),
      data_ai: s.array(s.string()),
    }),
    content: s.mdx(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts, about },
  // Links in MDX are site routes, not files to copy into public/static.
  mdx: { copyLinkedFiles: false },
});
