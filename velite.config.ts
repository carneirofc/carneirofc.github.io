import { defineCollection, defineConfig, s } from "velite";

// Locale is derived from the filename: `foo.mdx` is English, `foo.pt-br.mdx`
// is Brazilian Portuguese. Translations share the same base slug.
const LOCALE_SUFFIX = /\.pt-br$/;

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
      const raw = data.path.replace(/^blog\//, "");
      const locale = LOCALE_SUFFIX.test(raw) ? ("pt-br" as const) : ("en" as const);
      const slug = raw.replace(LOCALE_SUFFIX, "");
      const permalink = locale === "en" ? `/blog/${slug}/` : `/pt-br/blog/${slug}/`;
      return { ...data, locale, slug, permalink };
    }),
});

const abouts = defineCollection({
  name: "About",
  pattern: "about*.mdx",
  schema: s
    .object({
      title: s.string(),
      name: s.string(),
      role: s.string(),
      headline: s.string(),
      location: s.string(),
      email: s.string(),
      links: s.object({
        github: s.string().url(),
        linkedin: s.string().url(),
      }),
      skills: s.object({
        languages: s.array(s.string()),
        platform: s.array(s.string()),
        devsecops: s.array(s.string()),
        cloud: s.array(s.string()),
        data_ai: s.array(s.string()),
      }),
      path: s.path(),
      content: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      locale: LOCALE_SUFFIX.test(data.path) ? ("pt-br" as const) : ("en" as const),
    })),
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
  collections: { posts, abouts },
  // Links in MDX are site routes, not files to copy into public/static.
  mdx: { copyLinkedFiles: false },
});
