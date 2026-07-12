import { posts } from "#site/content";

export type Post = (typeof posts)[number];

const published = [...posts]
  .filter((post) => !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getAllPosts(): Post[] {
  return published;
}

export function getPostBySlug(slug: string): Post | undefined {
  return published.find((post) => post.slug === slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of published) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  return published.filter((post) => post.tags.includes(tag));
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function formatDate(date: string): string {
  return dateFormatter.format(new Date(date));
}

export function readingTimeLabel(minutes: number): string {
  return `${Math.max(1, Math.round(minutes))} min read`;
}
