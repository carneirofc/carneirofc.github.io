import Link from "next/link";
import { InfoChip, PageHeader } from "@carneirofc/ui";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

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

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={localePath(locale, `/blog/tags/${tag}/`)}
              className="focus-ring rounded-full"
            >
              <InfoChip>
                #{tag} ({count})
              </InfoChip>
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
