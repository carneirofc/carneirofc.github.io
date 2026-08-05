import Link from "next/link";
import { LuGithub, LuLinkedin, LuMail, LuMapPin, LuUser } from "react-icons/lu";
import { ChevronRightIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { buttonClass } from "@/lib/ui";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { getAbout, getAllPosts } from "@/lib/posts";
import { MetaDot, PostCard } from "@/components/post-card";
import { ProjectCard } from "@/components/project-card";
import { SectionNav, type SectionNavItem } from "@/components/section-nav";

const BUTTON_ICON = "h-3.5 w-3.5 shrink-0";
const SECTION_LINK =
  "focus-ring cyber-muted inline-flex items-center gap-1 rounded-md text-ui-sm hover:text-text";

export function HomePage({ locale }: { locale: Locale }) {
  const about = getAbout(locale);
  const t = getDictionary(locale);
  const latestPosts = getAllPosts(locale).slice(0, 3);

  const sections: SectionNavItem[] = [
    { href: "#intro", label: t.home.sections.intro, icon: "home" },
    { href: "#posts", label: t.home.sections.posts, icon: "posts" },
    { href: "#projects", label: t.home.sections.projects, icon: "projects" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <SectionNav items={sections} ariaLabel={t.home.sectionsAriaLabel} />

      {/* The intro breathes more than the card lists below (varied rhythm). */}
      <section id="intro" className="section-anchor flex flex-col gap-6 pb-4">
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
          <Link href={localePath(locale, "/about/")} className={buttonClass("accent", "md")}>
            <LuUser aria-hidden className={BUTTON_ICON} />
            {t.home.aboutMe}
          </Link>
          <a
            href={about.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("neutral", "md")}
          >
            <LuGithub aria-hidden className={BUTTON_ICON} />
            GitHub
          </a>
          <a
            href={about.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("neutral", "md")}
          >
            <LuLinkedin aria-hidden className={BUTTON_ICON} />
            LinkedIn
          </a>
          <a href={`mailto:${about.email}`} className={buttonClass("ghost", "md")}>
            <LuMail aria-hidden className={BUTTON_ICON} />
            {t.home.email}
          </a>
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section id="posts" className="section-anchor flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="cyber-title text-ui-lg font-semibold">{t.home.latestPosts}</h2>
            <Link href={localePath(locale, "/blog/")} className={SECTION_LINK}>
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

      <section id="projects" className="section-anchor flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="cyber-title text-ui-lg font-semibold">{t.home.featuredProjects}</h2>
          <Link href={localePath(locale, "/projects/")} className={SECTION_LINK}>
            {t.home.allProjects}
            <ChevronRightIcon aria-hidden className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.projects.entries.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
