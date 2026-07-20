import Link from "next/link";
import { InfoChip } from "@/components/info-chip";
import { SurfacePanel } from "@/components/surface-panel";
import { getDictionary, localePath } from "@/lib/i18n";
import { formatDate, readingTimeMinutes, type Post } from "@/lib/posts";

export function MetaDot() {
  return <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-current opacity-60" />;
}

export function PostCard({ post }: { post: Post }) {
  const t = getDictionary(post.locale);

  return (
    <SurfacePanel className="transition-colors hover:border-ui-active">
      <article className="flex flex-col gap-2">
        <div className="cyber-muted flex flex-wrap items-center gap-2 text-ui-xs">
          <time dateTime={post.date}>{formatDate(post.date, post.locale)}</time>
          <MetaDot />
          <span>{t.blog.minRead(readingTimeMinutes(post.metadata.readingTime))}</span>
        </div>
        <h2 className="text-ui-lg font-semibold">
          <Link
            href={post.permalink}
            className="focus-ring cyber-title rounded-md hover:text-accent"
          >
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className="cyber-muted text-ui-sm">{post.excerpt}</p>}
        {post.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={localePath(post.locale, `/blog/tags/${tag}/`)}
                className="focus-ring rounded-full"
              >
                <InfoChip>#{tag}</InfoChip>
              </Link>
            ))}
          </div>
        )}
      </article>
    </SurfacePanel>
  );
}
