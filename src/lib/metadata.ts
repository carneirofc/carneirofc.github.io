import type { Metadata } from "next";
import { localePath, type Locale } from "@/lib/i18n";
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
      siteName: "carneirofc.github.io",
      locale: locale === "en" ? "en_US" : "pt_BR",
    },
    twitter: {
      card: "summary",
      title: `${about.name} — ${about.role}`,
      description: about.headline,
    },
  };
}
