import { InfoChip } from "@/components/info-chip";
import { ProfileIntro } from "@/components/profile-intro";
import { SurfacePanel } from "@/components/surface-panel";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";
import { MDXContent } from "@/components/mdx-content";
import { SectionNav, type SectionNavItem } from "@/components/section-nav";

const SKILL_GROUPS = ["languages", "web", "platform", "devsecops", "cloud", "data_ai"] as const;
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
        <ProfileIntro locale={locale} subtitle={t.about.subtitle} />

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
