import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoChip } from "@carneirofc/ui";
import { MDXContent } from "@/components/mdx-content";
import { formatDate, getAllPosts, getPostBySlug, readingTimeLabel } from "@/lib/posts";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: post.permalink },
    openGraph: {
      type: "article",
      url: post.permalink,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="cyber-muted text-ui-xs uppercase tracking-[0.24em]">
          <Link href="/blog/" className="focus-ring rounded-md hover:text-text">
            carneirofc // blog
          </Link>
        </p>
        <h1 className="cyber-title text-ui-display font-semibold">{post.title}</h1>
        <div className="cyber-muted flex flex-wrap items-center gap-2 text-ui-sm">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{readingTimeLabel(post.metadata.readingTime)}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog/tags/${tag}/`} className="focus-ring rounded-full">
                <InfoChip>#{tag}</InfoChip>
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="prose max-w-none">
        <MDXContent code={post.content} />
      </div>

      <footer className="border-t border-line/80 pt-6">
        <Link
          href="/blog/"
          className="focus-ring cyber-muted rounded-md text-ui-sm hover:text-text"
        >
          ← back to all posts
        </Link>
      </footer>
    </article>
  );
}
