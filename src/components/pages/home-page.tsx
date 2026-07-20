import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { LuMail, LuMapPin, LuUser } from "react-icons/lu";
import { ChevronRightIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { SectionLabel } from "@/components/section-label";
import { buttonClass } from "@/lib/ui";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { getAbout, getAllPosts } from "@/lib/posts";
import { MetaDot, PostCard } from "@/components/post-card";
import { ProjectCard } from "@/components/project-card";
import { SectionNav, type SectionNavItem } from "@/components/section-nav";

const BUTTON_ICON = "h-3.5 w-3.5 shrink-0";
const SECTION_LINK =
  "focus-ring cyber-muted inline-flex items-center gap-1 rounded-md text-ui-sm hover:text-text";
// The last entry is the "everything else on GitHub" catch-all — the featured
// grid shows the real projects and the header link leads to the full list.
const FEATURED_PROJECTS = 4;

export function HomePage({ locale }: { locale: Locale }) {
  const about = getAbout(locale);
  const t = getDictionary(locale);
  const latestPosts = getAllPosts(locale).slice(0, 3);
  const featuredProjects = t.projects.entries.slice(0, FEATURED_PROJECTS);

  const sections: SectionNavItem[] = [
    { href: "#intro", label: t.home.sections.intro, icon: "home" },
    { href: "#posts", label: t.home.sections.posts, icon: "posts" },
    { href: "#projects", label: t.home.sections.projects, icon: "projects" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <SectionNav items={sections} ariaLabel={t.home.sectionsAriaLabel} />

      <section id="intro" className="section-anchor flex flex-col gap-6">
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
            <FaGithub aria-hidden className={BUTTON_ICON} />
            GitHub
          </a>
          <a
            href={about.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("neutral", "md")}
          >
            <FaLinkedin aria-hidden className={BUTTON_ICON} />
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
            <SectionLabel>{t.home.latestPosts}</SectionLabel>
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
          <SectionLabel>{t.home.featuredProjects}</SectionLabel>
          <Link href={localePath(locale, "/projects/")} className={SECTION_LINK}>
            {t.home.allProjects}
            <ChevronRightIcon aria-hidden className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
