import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoChip, PageHeader } from "@carneirofc/ui";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

type Params = { tag: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `Blog posts tagged #${tag}.`,
  };
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        subtitle="carneirofc // blog // tags"
        title={`#${tag}`}
        description={`Posts tagged #${tag}.`}
        pills={
          <InfoChip>
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </InfoChip>
        }
      />

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <Link href="/blog/" className="focus-ring cyber-muted rounded-md text-ui-sm hover:text-text">
        ← back to all posts
      </Link>
    </div>
  );
}
