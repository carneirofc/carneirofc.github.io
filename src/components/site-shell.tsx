import { IBM_Plex_Mono, Sora } from "next/font/google";
import { htmlLang, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import "@/app/globals.css";

const themeInitScript = `
(() => {
  try {
    const match = document.cookie.match(/(?:^|; )carneirofc-theme=(dark|light)/);
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
        className={`${display.variable} ${mono.variable} font-[var(--font-display)] antialiased`}
      >
        <ThemeToggle />
        <SiteHeader locale={locale} />
        <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
