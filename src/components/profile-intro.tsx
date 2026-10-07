import type { ReactNode } from "react";
import { LuGithub, LuLinkedin, LuMail, LuMapPin } from "react-icons/lu";
import { MetaDot } from "@/components/meta-dot";
import { PageHeader } from "@/components/page-header";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";
import { buttonClass } from "@/lib/ui";

export const BUTTON_ICON = "h-3.5 w-3.5 shrink-0";

/**
 * Name, headline, location · role and the contact buttons, shared by the home
 * and about pages. `primary` is an extra leading button; without one, GitHub
 * takes the accent style so each page has exactly one.
 */
export function ProfileIntro({
  locale,
  subtitle,
  primary,
}: {
  locale: Locale;
  subtitle: string;
  primary?: ReactNode;
}) {
  const about = getAbout(locale);
  const t = getDictionary(locale);

  return (
    <>
      <PageHeader subtitle={subtitle} title={about.name} description={about.headline} />

      <div className="cyber-muted flex flex-wrap items-center gap-2 text-ui-sm">
        <span className="inline-flex items-center gap-1.5">
          <LuMapPin aria-hidden className={BUTTON_ICON} />
          {about.location}
        </span>
        <MetaDot />
        <span>{about.role}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        {primary}
        <a
          href={about.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass(primary ? "neutral" : "accent", "md")}
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
    </>
  );
}
