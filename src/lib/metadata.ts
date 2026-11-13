import type { Metadata, Viewport } from "next";
import { getDictionary, localePath, ogLocale, type Locale } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";
import { OG_SIZE, ogImagePath } from "@/lib/og";
import { feedPath, feedTitle } from "@/lib/feed";

export const SITE_URL = "https://carneirofc.github.io";

/** Browser chrome colour per OS scheme; shared by both root layouts. */
export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c13" },
  ],
};

/** hreflang map for a route that exists in both locales. English, at the site
 *  root, doubles as `x-default` for every other language. */
export function languageAlternates(path: string): Record<string, string> {
  return {
    en: localePath("en", path),
    "pt-BR": localePath("pt-br", path),
    "x-default": localePath("en", path),
  };
}

/** Canonical + hreflang alternates for a route that exists in both locales,
 *  plus the locale's RSS feed so readers can discover it from any page. */
export function pageAlternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: languageAlternates(path),
    types: { "application/rss+xml": [{ url: feedPath(locale), title: feedTitle(locale) }] },
  };
}

const SITE_NAME = "carneirofc.github.io";

/** The page's generated social card (src/lib/og.ts), for og:image and
 *  twitter:image. Relative URLs resolve against `metadataBase`. */
function cardImages(locale: Locale, path: string, alt: string) {
  return [{ url: ogImagePath(locale, path), ...OG_SIZE, alt, type: "image/png" }];
}

/** `Name — tagline`: the home page's <title> and the social-card title. */
export function siteTitle(locale: Locale): string {
  return `${getAbout(locale).name} — ${getDictionary(locale).site.tagline}`;
}

/**
 * Title, description, alternates and complete Open Graph and Twitter blocks for
 * one page. Next replaces `openGraph` and `twitter` wholesale rather than
 * merging them with the layout's, so every page has to send its own —
 * otherwise it inherits the home page's url and title.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description }: { title: string; description?: string },
): Metadata {
  const images = cardImages(locale, path, title);
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
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export function buildSiteMetadata(locale: Locale): Metadata {
  const about = getAbout(locale);
  const title = siteTitle(locale);
  const images = cardImages(locale, "/", title);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
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
      title,
      description: about.headline,
      siteName: SITE_NAME,
      locale: ogLocale[locale],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: about.headline,
      images,
    },
  };
}
