import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";
import { InfoChip } from "@/components/info-chip";
import { PageHeader } from "@/components/page-header";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { pageAlternates } from "@/lib/metadata";

export function tagStaticParams(locale: Locale): { tag: string }[] {
  return getAllTags(locale).map(({ tag }) => ({ tag }));
}

export function tagMetadata(locale: Locale, tag: string): Metadata {
  const t = getDictionary(locale);
  return {
    title: `#${tag}`,
    description: t.blog.tagDescription(tag),
    alternates: pageAlternates(locale, `/blog/tags/${tag}/`),
  };
}

export function BlogTagPage({ locale, tag }: { locale: Locale; tag: string }) {
  const t = getDictionary(locale);
  const posts = getPostsByTag(locale, tag);
  if (posts.length === 0) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        subtitle={t.blog.tagSubtitle}
        title={`#${tag}`}
        description={t.blog.tagDescription(tag)}
        pills={
          <InfoChip>
            {posts.length} {posts.length === 1 ? t.blog.postSingular : t.blog.postPlural}
          </InfoChip>
        }
      />

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <Link
        href={localePath(locale, "/blog/")}
        className="focus-ring cyber-muted inline-flex items-center gap-1 rounded-md text-ui-sm hover:text-text"
      >
        <ChevronLeftIcon aria-hidden className="h-3.5 w-3.5" />
        {t.blog.backToAll}
      </Link>
    </div>
  );
}
