import { z } from "zod";

// Locale primitives, kept apart from the dictionaries so client components can
// import them without shipping every UI string (and its parse) to the browser.

export const locales = ["en", "pt-br"] as const;
export const localeSchema = z.enum(locales);
export type Locale = z.infer<typeof localeSchema>;

export const defaultLocale: Locale = "en";

/** BCP 47 tag for <html lang> and hreflang alternates. */
export const htmlLang: Record<Locale, string> = {
  en: "en",
  "pt-br": "pt-BR",
};

/** Open Graph `og:locale` per locale. */
export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  "pt-br": "pt_BR",
};

/** Prefix a site-root path ("/blog/") with the locale segment when needed. */
export function localePath(locale: Locale, path: string): string {
  return locale === "en" ? path : `/pt-br${path}`;
}

export const localizedPathSchema = z.object({ locale: localeSchema, path: z.string() });
export type LocalizedPath = z.infer<typeof localizedPathSchema>;

/**
 * Map a pathname to its equivalent in the other locale. Both directions keep
 * the trailing slash the static export (`trailingSlash: true`) emits, so the
 * link lands on the generated page instead of a Pages redirect.
 */
export function alternatePath(pathname: string): LocalizedPath {
  if (pathname === "/pt-br" || pathname.startsWith("/pt-br/")) {
    return { locale: "en", path: pathname.replace(/^\/pt-br/, "") || "/" };
  }
  return { locale: "pt-br", path: pathname === "/" ? "/pt-br/" : `/pt-br${pathname}` };
}
