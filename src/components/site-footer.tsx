import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { LuGlobe, LuMail } from "react-icons/lu";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";

const LINK_CLASS = "focus-ring inline-flex items-center gap-1.5 rounded-md hover:text-text";
const ICON_CLASS = "h-3.5 w-3.5 shrink-0";

export function SiteFooter({ locale }: { locale: Locale }) {
  const about = getAbout(locale);
  const t = getDictionary(locale);

  return (
    <footer className="mt-12 border-t border-line/80 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 text-ui-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          {new Date().getFullYear()} {about.name}. {t.footer.rightsReserved}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a href={about.links.github} className={LINK_CLASS}>
            <FaGithub aria-hidden className={ICON_CLASS} />
            GitHub
          </a>
          <a href={about.links.linkedin} className={LINK_CLASS}>
            <FaLinkedin aria-hidden className={ICON_CLASS} />
            LinkedIn
          </a>
          <a href={about.links.projects} className={LINK_CLASS}>
            <LuGlobe aria-hidden className={ICON_CLASS} />
            deedlit.dev
          </a>
          <a href={`mailto:${about.email}`} className={LINK_CLASS}>
            <LuMail aria-hidden className={ICON_CLASS} />
            {about.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
