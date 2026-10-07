import Link from "next/link";
import { LuChevronRight, LuUser } from "react-icons/lu";
import { buttonClass } from "@/lib/ui";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { BUTTON_ICON, ProfileIntro } from "@/components/profile-intro";
import { ProjectCard } from "@/components/project-card";
import { SectionNav, type SectionNavItem } from "@/components/section-nav";

const SECTION_LINK =
  "focus-ring cyber-muted inline-flex items-center gap-1 rounded-md text-ui-sm hover:text-text";

export function HomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const latestPosts = getAllPosts(locale).slice(0, 3);
  const featuredProjects = t.projects.entries.filter((project) => project.featured);

  // The posts section only renders when there are posts; so does its rail link.
  const sections: SectionNavItem[] = [
    { href: "#intro", label: t.home.sections.intro, icon: "home" },
    ...(latestPosts.length > 0
      ? [{ href: "#posts", label: t.home.sections.posts, icon: "posts" } as const]
      : []),
    { href: "#projects", label: t.home.sections.projects, icon: "projects" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <SectionNav items={sections} ariaLabel={t.home.sectionsAriaLabel} />

      {/* The intro breathes more than the card lists below (varied rhythm). */}
      <section id="intro" className="section-anchor flex flex-col gap-6 pb-4">
        <ProfileIntro
          locale={locale}
          subtitle={t.home.subtitle}
          primary={
            <Link href={localePath(locale, "/about/")} className={buttonClass("accent", "md")}>
              <LuUser aria-hidden className={BUTTON_ICON} />
              {t.home.aboutMe}
            </Link>
          }
        />
      </section>

      {latestPosts.length > 0 && (
        <section id="posts" className="section-anchor flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="cyber-title text-ui-lg font-semibold">{t.home.latestPosts}</h2>
            <Link href={localePath(locale, "/blog/")} className={SECTION_LINK}>
              {t.home.allPosts}
              <LuChevronRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <section id="projects" className="section-anchor flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="cyber-title text-ui-lg font-semibold">{t.home.featuredProjects}</h2>
          <Link href={localePath(locale, "/projects/")} className={SECTION_LINK}>
            {t.home.allProjects}
            <LuChevronRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.name} project={project} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
