import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { LuGlobe, LuMail } from "react-icons/lu";
import {
  ChevronRightIcon,
  InfoChip,
  OutlineButton,
  PageHeader,
  SectionLabel,
  SurfacePanel,
} from "@carneirofc/ui";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { getAbout, getAllPosts } from "@/lib/posts";
import { MDXContent } from "@/components/mdx-content";
import { PostCard } from "@/components/post-card";

const SKILL_GROUPS = ["languages", "platform", "devsecops", "cloud", "data_ai"] as const;
const BUTTON_ICON = "h-3.5 w-3.5 shrink-0";

export function HomePage({ locale }: { locale: Locale }) {
  const about = getAbout(locale);
  const t = getDictionary(locale);
  const latestPosts = getAllPosts(locale).slice(0, 3);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        subtitle={t.home.subtitle}
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
          <a href={about.links.github}>
            <FaGithub aria-hidden className={BUTTON_ICON} />
            GitHub
          </a>
        </OutlineButton>
        <OutlineButton asChild controlSize="md">
          <a href={about.links.linkedin}>
            <FaLinkedin aria-hidden className={BUTTON_ICON} />
            LinkedIn
          </a>
        </OutlineButton>
        <OutlineButton asChild controlSize="md">
          <a href={about.links.projects}>
            <LuGlobe aria-hidden className={BUTTON_ICON} />
            deedlit.dev
          </a>
        </OutlineButton>
        <OutlineButton asChild variant="ghost" controlSize="md">
          <a href={`mailto:${about.email}`}>
            <LuMail aria-hidden className={BUTTON_ICON} />
            {t.home.email}
          </a>
        </OutlineButton>
      </div>

      <SurfacePanel tone="soft" padding="lg">
        <div className="flex flex-col gap-4">
          {SKILL_GROUPS.map((key) => (
            <div key={key} className="flex flex-col gap-2">
              <SectionLabel>{t.home.skills[key]}</SectionLabel>
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
            <SectionLabel>{t.home.latestPosts}</SectionLabel>
            <Link
              href={localePath(locale, "/blog/")}
              className="focus-ring cyber-muted inline-flex items-center gap-1 rounded-md text-ui-sm hover:text-text"
            >
              {t.home.allPosts}
              <ChevronRightIcon aria-hidden className="h-3.5 w-3.5" />
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
