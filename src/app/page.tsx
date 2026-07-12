import Link from "next/link";
import { InfoChip, OutlineButton, PageHeader, SectionLabel, SurfacePanel } from "@carneirofc/ui";
import { about } from "#site/content";
import { MDXContent } from "@/components/mdx-content";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

const SKILL_GROUPS: { key: keyof typeof about.skills; label: string }[] = [
  { key: "languages", label: "Languages" },
  { key: "platform", label: "Platform" },
  { key: "devsecops", label: "DevSecOps" },
  { key: "cloud", label: "Cloud" },
  { key: "data_ai", label: "Data & AI" },
];

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        subtitle="carneirofc // about"
        title={about.name}
        description={about.headline}
        pills={
          <>
            <InfoChip>{about.location}</InfoChip>
            <InfoChip>{about.role}</InfoChip>
          </>
        }
      />

      <div className="flex flex-wrap gap-3">
        <OutlineButton asChild variant="accent" controlSize="md">
          <a href={about.links.github}>GitHub</a>
        </OutlineButton>
        <OutlineButton asChild controlSize="md">
          <a href={about.links.linkedin}>LinkedIn</a>
        </OutlineButton>
        <OutlineButton asChild controlSize="md">
          <a href={about.links.projects}>deedlit.dev</a>
        </OutlineButton>
        <OutlineButton asChild variant="ghost" controlSize="md">
          <a href={`mailto:${about.email}`}>Email</a>
        </OutlineButton>
      </div>

      <SurfacePanel tone="soft" padding="lg">
        <div className="flex flex-col gap-4">
          {SKILL_GROUPS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-2">
              <SectionLabel>{label}</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {about.skills[key].map((skill) => (
                  <InfoChip key={skill}>{skill}</InfoChip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SurfacePanel>

      <article className="prose max-w-none">
        <MDXContent code={about.content} />
      </article>

      {latestPosts.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SectionLabel>Latest posts</SectionLabel>
            <Link
              href="/blog/"
              className="focus-ring cyber-muted rounded-md text-ui-sm hover:text-text"
            >
              all posts →
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
