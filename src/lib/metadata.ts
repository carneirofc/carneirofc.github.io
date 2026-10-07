import type { Metadata } from "next";
import { localePath, ogLocale, type Locale } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";

export const SITE_URL = "https://carneirofc.github.io";

/** Canonical + hreflang alternates for a route that exists in both locales. */
export function pageAlternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: {
      en: localePath("en", path),
      "pt-BR": localePath("pt-br", path),
    },
  };
}

const SITE_NAME = "carneirofc.github.io";

/**
 * Title, description, alternates and a complete Open Graph block for one page.
 * Next replaces `openGraph` wholesale rather than merging it with the layout's,
 * so every page has to send its own — otherwise it inherits the home page's url.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description }: { title: string; description?: string },
): Metadata {
  return {
    title,
    description,
    alternates: pageAlternates(locale, path),
    openGraph: {
      type: "website",
      url: localePath(locale, path),
      title,
      description,
      siteName: SITE_NAME,
      locale: ogLocale[locale],
    },
  };
}

export function buildSiteMetadata(locale: Locale): Metadata {
  const about = getAbout(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${about.name} | carneirofc`,
      template: "%s | carneirofc",
    },
    description: about.headline,
    authors: [{ name: about.name, url: about.links.github }],
    creator: about.name,
    alternates: pageAlternates(locale, "/"),
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      url: localePath(locale, "/"),
      title: `${about.name} — ${about.role}`,
      description: about.headline,
      siteName: SITE_NAME,
      locale: ogLocale[locale],
    },
    twitter: {
      card: "summary",
      title: `${about.name} — ${about.role}`,
      description: about.headline,
    },
  };
}
