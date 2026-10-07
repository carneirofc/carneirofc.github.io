import { InfoChip } from "@/components/info-chip";
import { PageHeader } from "@/components/page-header";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { TagLinks } from "@/components/tag-links";

export function BlogIndexPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const posts = getAllPosts(locale);
  const tags = getAllTags(locale);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        subtitle={t.blog.subtitle}
        title={t.blog.title}
        description={t.blog.description}
        pills={
          <InfoChip>
            {posts.length} {posts.length === 1 ? t.blog.postSingular : t.blog.postPlural}
          </InfoChip>
        }
      />

      <TagLinks locale={locale} tags={tags} />

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
