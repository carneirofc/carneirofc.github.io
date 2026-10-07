import type { Metadata, Viewport } from "next";
import { SiteShell } from "@/components/site-shell";
import { buildSiteMetadata, siteViewport } from "@/lib/metadata";

export const metadata: Metadata = buildSiteMetadata("pt-br");

export const viewport: Viewport = siteViewport;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="pt-br">{children}</SiteShell>;
}
