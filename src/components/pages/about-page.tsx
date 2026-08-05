import { LuGithub, LuLinkedin, LuMail, LuMapPin } from "react-icons/lu";
import { InfoChip } from "@/components/info-chip";
import { PageHeader } from "@/components/page-header";
import { SurfacePanel } from "@/components/surface-panel";
import { buttonClass } from "@/lib/ui";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";
import { MDXContent } from "@/components/mdx-content";
import { MetaDot } from "@/components/post-card";
import { SectionNav, type SectionNavItem } from "@/components/section-nav";

const SKILL_GROUPS = ["languages", "web", "platform", "devsecops", "cloud", "data_ai"] as const;
const BUTTON_ICON = "h-3.5 w-3.5 shrink-0";
// Roomier than the default chip so the skills read comfortably.
const SKILL_CHIP = "px-3 py-1.5 text-ui-sm";

export function AboutPage({ locale }: { locale: Locale }) {
  const about = getAbout(locale);
  const t = getDictionary(locale);

  const sections: SectionNavItem[] = [
    { href: "#bio", label: t.about.sections.bio, icon: "about" },
    { href: "#skills", label: t.about.sections.skills, icon: "skills" },
  ];

  return (
    <div className="flex flex-col gap-12">
      <SectionNav items={sections} ariaLabel={t.about.sectionsAriaLabel} />

      {/* The bio breathes more than the skills panel below (varied rhythm). */}
      <section id="bio" className="section-anchor flex flex-col gap-6 pb-4">
        <PageHeader subtitle={t.about.subtitle} title={about.name} description={about.headline} />

        <div className="cyber-muted flex flex-wrap items-center gap-2 text-ui-sm">
          <span className="inline-flex items-center gap-1.5">
            <LuMapPin aria-hidden className="h-3.5 w-3.5 shrink-0" />
            {about.location}
          </span>
          <MetaDot />
          <span>{about.role}</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={about.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("accent", "md")}
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

        <article className="prose max-w-none">
          <MDXContent code={about.content} />
        </article>
      </section>

      <section id="skills" className="section-anchor flex flex-col gap-4">
        <h2 className="cyber-title text-ui-lg font-semibold">{t.about.sections.skills}</h2>
        <SurfacePanel>
          <div className="flex flex-col gap-5">
            {SKILL_GROUPS.map((key) => (
              <div key={key} className="flex flex-col gap-2">
                <h3 className="cyber-muted text-ui-sm font-medium">{t.about.skills[key]}</h3>
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
