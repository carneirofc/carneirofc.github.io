import Link from "next/link";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { LocaleSwitch } from "@/components/locale-switch";
import { cn } from "@/lib/ui";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const switchTo = getDictionary(locale === "en" ? "pt-br" : "en").localeSwitch;
  const nav = [
    // The wordmark already links home, so below md — where the nav gets its
    // own row and space is tight — this entry is dropped.
    { href: localePath(locale, "/"), label: t.nav.home, desktopOnly: true },
    { href: localePath(locale, "/about/"), label: t.nav.about },
    { href: localePath(locale, "/blog/"), label: t.nav.blog },
    { href: localePath(locale, "/projects/"), label: t.nav.projects },
    { href: localePath(locale, "/contact/"), label: t.nav.contact },
  ];

  // Below md the nav drops to its own full-width row — the wordmark plus five
  // links don't fit a 360px screen. From md up it is a single row.
  //
  // The theme toggle is @carneirofc/ui's draggable floating button, parked at
  // the viewport's top-right (right-4 top-4, md:right-6 md:top-5, 40px). The
  // header stays out of its way: the first row is 40px tall under top padding
  // that matches the toggle's offset, so the toggle sits centred on that row,
  // and the locale switch (the row's last item) keeps an mr-12 gutter until
  // lg, where the centred max-w-4xl column already clears the corner.
  //
  // Sticky only from md: on a phone a two-row sticky header would cover ~11%
  // of the viewport.
  return (
    <header className="top-0 z-40 border-b border-line/80 bg-base/85 backdrop-blur md:sticky">
      <div className="mx-auto grid max-w-4xl grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 px-4 pb-3 pt-4 sm:px-6 md:grid-cols-[auto_1fr_auto] md:py-5 lg:px-8">
        <Link
          href={localePath(locale, "/")}
          className="focus-ring cyber-title flex min-h-10 items-center justify-self-start rounded-md text-ui-md font-semibold"
        >
          carneirofc
        </Link>
        <div className="mr-12 md:order-last lg:mr-0">
          <LocaleSwitch label={switchTo.label} ariaLabel={switchTo.ariaLabel} />
        </div>
        {/* Mono, //-prefixed links echo the `carneirofc // page` eyebrow motif
            so the nav reads in this site's voice instead of the generic
            wordmark-plus-links bar. */}
        <nav
          aria-label={t.nav.ariaLabel}
          className="col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-ui-xs sm:gap-x-5 md:col-span-1 md:justify-self-end"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring cyber-muted rounded-md py-1 lowercase transition-colors hover:text-text",
                item.desktopOnly && "hidden md:inline",
              )}
            >
              <span aria-hidden className="text-accent/60">
                {"//"}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
