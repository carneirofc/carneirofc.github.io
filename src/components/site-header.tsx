import Link from "next/link";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { LocaleSwitch } from "@/components/locale-switch";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const nav = [
    { href: localePath(locale, "/"), label: t.nav.home },
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
        <nav className="flex items-center gap-4 text-ui-sm sm:gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring cyber-muted rounded-md transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
          <LocaleSwitch />
        </nav>
      </div>
    </header>
  );
}
