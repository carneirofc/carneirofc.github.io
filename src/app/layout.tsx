import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import { about } from "#site/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://carneirofc.github.io"),
  title: {
    default: `${about.name} | carneirofc`,
    template: "%s | carneirofc",
  },
  description: about.headline,
  authors: [{ name: about.name, url: about.links.github }],
  creator: about.name,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://carneirofc.github.io",
    title: `${about.name} — ${about.role}`,
    description: about.headline,
    siteName: "carneirofc.github.io",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `${about.name} — ${about.role}`,
    description: about.headline,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c13" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${display.variable} ${mono.variable} font-[var(--font-display)] antialiased`}
      >
        <ThemeToggle />
        <SiteHeader />
        <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
