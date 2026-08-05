import { LuArrowUpRight, LuGithub, LuLinkedin, LuMail } from "react-icons/lu";
import { PageHeader } from "@/components/page-header";
import { SurfacePanel } from "@/components/surface-panel";
import { buttonClass } from "@/lib/ui";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";

const SECONDARY_LINK =
  "focus-ring cyber-muted inline-flex items-center gap-1.5 rounded-md text-ui-sm hover:text-text";

export function ContactPage({ locale }: { locale: Locale }) {
  const about = getAbout(locale);
  const t = getDictionary(locale);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        subtitle={t.contact.subtitle}
        title={t.contact.title}
        description={t.contact.description}
      />

      {/* Email is the channel the description points at, so it gets the panel;
          GitHub and LinkedIn are secondary and stay inline links. */}
      <SurfacePanel className="sm:max-w-xl">
        <div className="flex flex-col gap-3">
          <h2 className="cyber-title inline-flex items-center gap-1.5 text-ui-md font-semibold">
            <LuMail aria-hidden className="h-4 w-4 shrink-0" />
            {t.contact.email.label}
          </h2>
          <p className="cyber-muted break-words text-ui-sm">{about.email}</p>
          <div>
            <a href={`mailto:${about.email}`} className={buttonClass("accent", "md")}>
              {t.contact.email.cta}
            </a>
          </div>
        </div>
      </SurfacePanel>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <a
          href={about.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className={SECONDARY_LINK}
        >
          <LuGithub aria-hidden className="h-3.5 w-3.5 shrink-0" />
          {about.links.github.replace("https://", "")}
          <LuArrowUpRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
        </a>
        <a
          href={about.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={SECONDARY_LINK}
        >
          <LuLinkedin aria-hidden className="h-3.5 w-3.5 shrink-0" />
          {t.contact.linkedin.label}
          <LuArrowUpRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
        </a>
      </div>
    </div>
  );
}
