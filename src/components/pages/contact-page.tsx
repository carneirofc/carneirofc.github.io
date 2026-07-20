import type { IconType } from "react-icons";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { LuMail } from "react-icons/lu";
import { PageHeader } from "@/components/page-header";
import { SectionLabel } from "@/components/section-label";
import { SurfacePanel } from "@/components/surface-panel";
import { buttonClass } from "@/lib/ui";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";

export function ContactPage({ locale }: { locale: Locale }) {
  const about = getAbout(locale);
  const t = getDictionary(locale);

  const channels: { icon: IconType; label: string; value: string; href: string; cta: string }[] = [
    {
      icon: LuMail,
      label: t.contact.email.label,
      value: about.email,
      href: `mailto:${about.email}`,
      cta: t.contact.email.cta,
    },
    {
      icon: FaGithub,
      label: t.contact.github.label,
      value: about.links.github.replace("https://", ""),
      href: about.links.github,
      cta: t.contact.github.cta,
    },
    {
      icon: FaLinkedin,
      label: t.contact.linkedin.label,
      value: about.name,
      href: about.links.linkedin,
      cta: t.contact.linkedin.cta,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        subtitle={t.contact.subtitle}
        title={t.contact.title}
        description={t.contact.description}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {channels.map((channel) => (
          <SurfacePanel key={channel.label}>
            <div className="flex h-full flex-col gap-3">
              <SectionLabel className="inline-flex items-center gap-1.5">
                <channel.icon aria-hidden className="h-3.5 w-3.5 shrink-0" />
                {channel.label}
              </SectionLabel>
              <p className="cyber-title flex-1 break-words text-ui-sm font-medium">
                {channel.value}
              </p>
              <div>
                <a
                  href={channel.href}
                  className={buttonClass("neutral", "sm")}
                  {...(channel.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {channel.cta}
                </a>
              </div>
            </div>
          </SurfacePanel>
        ))}
      </div>
    </div>
  );
}
