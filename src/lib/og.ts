import { z } from "zod";
import { getDictionary, localePath, locales, localeSchema, type Locale } from "@/lib/i18n";
import { formatDate, getAbout, getAllPosts, getAllTags } from "@/lib/posts";

// Social cards (og:image / twitter:image), one PNG per page, rendered at build
// time by src/app/og/[...slug]/route.tsx. This module is the registry: every
// route that has a card is listed here, and pageMetadata() links the same URL.

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const ogCardSchema = z.object({
  locale: localeSchema,
  /** Site path without the locale prefix, e.g. "/blog/hello-world/". */
  path: z.string().startsWith("/").endsWith("/"),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  /** Small print under the description: a post's date and tags. */
  meta: z.array(z.string().min(1)).optional(),
});
export type OgCard = z.infer<typeof ogCardSchema>;

const FILE = "card.png";

/** `/og/en/blog/hello-world/card.png` — URL of a page's card. */
export function ogImagePath(locale: Locale, path: string): string {
  return `/og/${locale}${path}${FILE}`;
}

/** The route handler's catch-all segments for one card. */
export function ogSlug(card: OgCard): string[] {
  return [card.locale, ...card.path.split("/").filter(Boolean), FILE];
}

function cardsFor(locale: Locale): OgCard[] {
  const t = getDictionary(locale);
  const about = getAbout(locale);
  const posts = getAllPosts(locale);

  return [
    {
      locale,
      path: "/",
      eyebrow: t.home.subtitle,
      title: about.name,
      description: about.headline,
    },
    {
      locale,
      path: "/about/",
      eyebrow: t.about.subtitle,
      title: t.about.title,
      description: t.about.description,
    },
    {
      locale,
      path: "/blog/",
      eyebrow: t.blog.subtitle,
      title: t.blog.title,
      description: t.blog.description,
    },
    {
      locale,
      path: "/projects/",
      eyebrow: t.projects.subtitle,
      title: t.projects.title,
      description: t.projects.description,
    },
    {
      locale,
      path: "/contact/",
      eyebrow: t.contact.subtitle,
      title: t.contact.title,
      description: t.contact.description,
    },
    ...posts.map((post) => ({
      locale,
      path: `/blog/${post.slug}/`,
      eyebrow: t.blog.subtitle,
      title: post.title,
      description: post.excerpt,
      meta: [formatDate(post.date, locale), ...post.tags.map((tag) => `#${tag}`)],
    })),
    ...getAllTags(locale).map(({ tag }) => ({
      locale,
      path: `/blog/tags/${tag}/`,
      eyebrow: t.blog.tagSubtitle,
      title: `#${tag}`,
      description: t.blog.tagDescription(tag),
    })),
  ];
}

/** Every card on the site, parsed so a malformed entry fails the build. */
export function allOgCards(): OgCard[] {
  return z.array(ogCardSchema).parse(locales.flatMap(cardsFor));
}

export function findOgCard(slug: string[]): OgCard | undefined {
  const key = slug.join("/");
  return allOgCards().find((card) => ogSlug(card).join("/") === key);
}

/** The page URL a card belongs to, for its footer. */
export function ogCardUrl(card: OgCard): string {
  return `carneirofc.github.io${localePath(card.locale, card.path)}`;
}
