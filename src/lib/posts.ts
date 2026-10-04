import { z } from "zod";
import { posts, abouts } from "#site/content";
import type { Locale } from "@/lib/i18n";

export type Post = (typeof posts)[number];
export type About = (typeof abouts)[number];

const published = [...posts]
  .filter((post) => !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getAllPosts(locale: Locale): Post[] {
  return published.filter((post) => post.locale === locale);
}

export function getPostBySlug(locale: Locale, slug: string): Post | undefined {
  return published.find((post) => post.locale === locale && post.slug === slug);
}

/** The same post in the other locale, if it exists. */
export function getTranslation(post: Post): Post | undefined {
  return published.find((p) => p.slug === post.slug && p.locale !== post.locale);
}

export const tagCountSchema = z.object({ tag: z.string(), count: z.number().int().positive() });
export type TagCount = z.infer<typeof tagCountSchema>;

export function getAllTags(locale: Locale): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts(locale)) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(locale: Locale, tag: string): Post[] {
  return getAllPosts(locale).filter((post) => post.tags.includes(tag));
}

export function getAbout(locale: Locale): About {
  // No fallback: every page exists in both locales, so a missing translation
  // fails the build instead of shipping English copy under /pt-br/.
  const about = abouts.find((entry) => entry.locale === locale);
  if (!about) throw new Error(`about page for locale "${locale}" is missing`);
  return about;
}

const dateFormatters: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }),
  "pt-br": new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" }),
};

export function formatDate(date: string, locale: Locale): string {
  return dateFormatters[locale].format(new Date(date));
}

export function readingTimeMinutes(minutes: number): number {
  return Math.max(1, Math.round(minutes));
}
