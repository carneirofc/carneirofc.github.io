import { IBM_Plex_Mono, Sora } from "next/font/google";
import { getDictionary, htmlLang, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Providers } from "@/components/providers";
import { THEME_COOKIE_PATTERN } from "@/lib/theme";
import "@/app/globals.css";

const themeInitScript = `
(() => {
  try {
    const match = document.cookie.match(new RegExp(${JSON.stringify(THEME_COOKIE_PATTERN)}));
    const stored = match ? match[1] : null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const resolved = stored || preferred;
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  } catch {}
})();
`;

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={htmlLang[locale]} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${display.variable} ${mono.variable} font-(family-name:--font-display) antialiased`}
      >
        {/* First tab stop: jump past the header nav. Visually hidden until
            focused, then pinned over the header's top-left corner. */}
        <a
          href="#main"
          className="focus-ring sr-only rounded-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-surface focus:px-3 focus:py-2 focus:text-ui-sm focus:text-text focus:shadow-soft"
        >
          {getDictionary(locale).nav.skipToContent}
        </a>
        <Providers>
          <ThemeToggle />
          <SiteHeader locale={locale} />
          <main
            id="main"
            tabIndex={-1}
            className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10 outline-none sm:px-6 lg:px-8"
          >
            {children}
          </main>
          <SiteFooter locale={locale} />
        </Providers>
      </body>
    </html>
  );
}
