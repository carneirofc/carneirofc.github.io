import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";
import { getDictionary } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";
import { pageAlternates } from "@/lib/metadata";

const t = getDictionary("en");

export const metadata: Metadata = {
  title: t.about.title,
  description: getAbout("en").headline,
  alternates: pageAlternates("en", "/about/"),
};

export default function Page() {
  return <AboutPage locale="en" />;
}
