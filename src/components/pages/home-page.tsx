import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { LuMail, LuMapPin } from "react-icons/lu";
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
import { MetaDot, PostCard } from "@/components/post-card";
import { SectionNav, type SectionNavItem } from "@/components/section-nav";

const SKILL_GROUPS = ["languages", "platform", "devsecops", "cloud", "data_ai"] as const;
const BUTTON_ICON = "h-3.5 w-3.5 shrink-0";
// Roomier than the default chip so the skills read comfortably.
const SKILL_CHIP = "px-3 py-1.5 text-ui-sm";

export function HomePage({ locale }: { locale: Locale }) {
  const about = getAbout(locale);
  const t = getDictionary(locale);
  const latestPosts = getAllPosts(locale).slice(0, 3);

  const sections: SectionNavItem[] = [
    { href: "#about", label: t.home.sections.about, icon: "about" },
    { href: "#posts", label: t.home.sections.posts, icon: "posts" },
    { href: "#skills", label: t.home.sections.skills, icon: "skills" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <SectionNav items={sections} ariaLabel={t.home.sectionsAriaLabel} />

      <section id="about" className="section-anchor flex flex-col gap-6">
        <PageHeader subtitle={t.home.subtitle} title={about.name} description={about.headline} />

        <div className="cyber-muted flex flex-wrap items-center gap-2 text-ui-sm">
          <span className="inline-flex items-center gap-1.5">
            <LuMapPin aria-hidden className="h-3.5 w-3.5 shrink-0" />
            {about.location}
          </span>
          <MetaDot />
          <span>{about.role}</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <OutlineButton asChild variant="accent" controlSize="md">
            <a href={about.links.github} target="_blank" rel="noopener noreferrer">
              <FaGithub aria-hidden className={BUTTON_ICON} />
              GitHub
            </a>
          </OutlineButton>
          <OutlineButton asChild controlSize="md">
            <a href={about.links.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin aria-hidden className={BUTTON_ICON} />
              LinkedIn
            </a>
          </OutlineButton>
          <OutlineButton asChild variant="ghost" controlSize="md">
            <a href={`mailto:${about.email}`}>
              <LuMail aria-hidden className={BUTTON_ICON} />
              {t.home.email}
            </a>
          </OutlineButton>
        </div>

        <article className="prose max-w-none">
          <MDXContent code={about.content} />
        </article>
      </section>

      {latestPosts.length > 0 && (
        <section id="posts" className="section-anchor flex flex-col gap-4">
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

      <section id="skills" className="section-anchor flex flex-col gap-4">
        <SectionLabel>{t.home.sections.skills}</SectionLabel>
        <SurfacePanel tone="soft" padding="lg">
          <div className="flex flex-col gap-5">
            {SKILL_GROUPS.map((key) => (
              <div key={key} className="flex flex-col gap-2">
                <SectionLabel>{t.home.skills[key]}</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {about.skills[key].map((skill) => (
                    <InfoChip key={skill} className={SKILL_CHIP}>
                      {skill}
                    </InfoChip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SurfacePanel>
      </section>
    </div>
  );
}
