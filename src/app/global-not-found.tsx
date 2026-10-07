import type { Metadata } from "next";
import { NotFoundPage } from "@/components/pages/not-found-page";
import { SiteShell } from "@/components/site-shell";
import { getDictionary } from "@/lib/i18n";

// GitHub Pages serves one 404.html for every locale, so it is English.
const t = getDictionary("en");

export const metadata: Metadata = {
  title: `${t.notFound.title} | carneirofc`,
  description: t.notFound.description,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <SiteShell locale="en">
      <NotFoundPage locale="en" />
    </SiteShell>
  );
}
