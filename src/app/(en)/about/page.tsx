import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";
import { getDictionary } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";
import { pageMetadata } from "@/lib/metadata";

const t = getDictionary("en");

export const metadata: Metadata = pageMetadata("en", "/about/", {
  title: t.about.title,
  description: getAbout("en").headline,
});

export default function Page() {
  return <AboutPage locale="en" />;
}
