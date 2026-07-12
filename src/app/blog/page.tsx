import type { Metadata } from "next";
import Link from "next/link";
import { InfoChip, PageHeader } from "@carneirofc/ui";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on platform engineering, DevSecOps, and building software.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        subtitle="carneirofc // blog"
        title="Blog"
        description="Notes on platform engineering, DevSecOps, and building software."
        pills={
          <InfoChip>
            {posts.length} post{posts.length === 1 ? "" : "s"}
          </InfoChip>
        }
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link key={tag} href={`/blog/tags/${tag}/`} className="focus-ring rounded-full">
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
