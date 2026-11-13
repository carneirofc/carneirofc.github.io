import { LuGithub, LuLinkedin, LuMail, LuRss } from "react-icons/lu";
import { LocaleSwitch } from "@/components/locale-switch";
import { feedPath } from "@/lib/feed";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";

const LINK_CLASS = "focus-ring inline-flex items-center gap-1.5 rounded-md hover:text-text";
const ICON_CLASS = "h-3.5 w-3.5 shrink-0";
const SITE_SOURCE = "https://github.com/carneirofc/carneirofc.github.io";

export function SiteFooter({ locale }: { locale: Locale }) {
  const about = getAbout(locale);
  const t = getDictionary(locale);
  const switchTo = getDictionary(locale === "en" ? "pt-br" : "en").localeSwitch;

  return (
    <footer className="mt-12 border-t border-line/80 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 text-ui-sm text-muted sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {about.name}. {t.footer.rightsReserved}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={about.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              <LuGithub aria-hidden className={ICON_CLASS} />
              GitHub
            </a>
            <a
              href={about.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              <LuLinkedin aria-hidden className={ICON_CLASS} />
              LinkedIn
            </a>
            <a href={`mailto:${about.email}`} className={LINK_CLASS}>
              <LuMail aria-hidden className={ICON_CLASS} />
              {about.email}
            </a>
          </div>
        </div>
        {/* Secondary links in the header nav's mono //-voice. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-ui-xs">
          <a href={feedPath(locale)} className={LINK_CLASS}>
            <LuRss aria-hidden className={ICON_CLASS} />
            {t.footer.rss}
          </a>
          <a href={SITE_SOURCE} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            <span aria-hidden className="text-accent/60">
              {"//"}
            </span>
            {t.footer.source}
          </a>
          <LocaleSwitch label={switchTo.label} ariaLabel={switchTo.ariaLabel} />
        </div>
      </div>
    </footer>
  );
}
