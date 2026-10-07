import Link from "next/link";
import { MetaDot } from "@/components/meta-dot";
import { SurfacePanel } from "@/components/surface-panel";
import { TagLinks } from "@/components/tag-links";
import { getDictionary } from "@/lib/i18n";
import { formatDate, readingTimeMinutes, type Post } from "@/lib/posts";

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
        <TagLinks locale={post.locale} tags={post.tags.map((tag) => ({ tag }))} className="mt-1" />
      </article>
    </SurfacePanel>
  );
}
