import Link from "next/link";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { LocaleSwitch } from "@/components/locale-switch";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const nav = [
    { href: localePath(locale, "/"), label: t.nav.home },
    { href: localePath(locale, "/about/"), label: t.nav.about },
    { href: localePath(locale, "/blog/"), label: t.nav.blog },
    { href: localePath(locale, "/projects/"), label: t.nav.projects },
    { href: localePath(locale, "/contact/"), label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href={localePath(locale, "/")}
          className="focus-ring cyber-title rounded-md text-ui-md font-semibold"
        >
          carneirofc
        </Link>
        {/* Mono, //-prefixed links echo the `carneirofc // page` eyebrow motif
            so the nav reads in this site's voice instead of the generic
            wordmark-plus-links bar. */}
        <nav className="flex items-center gap-3 font-mono text-ui-xs sm:gap-5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring cyber-muted rounded-md lowercase transition-colors hover:text-text"
            >
              <span aria-hidden className="text-accent/60">
                {"//"}
              </span>
              {item.label}
            </Link>
          ))}
          <LocaleSwitch />
        </nav>
      </div>
    </header>
  );
}
