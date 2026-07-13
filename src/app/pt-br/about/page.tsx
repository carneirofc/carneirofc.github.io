import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";
import { getDictionary } from "@/lib/i18n";
import { getAbout } from "@/lib/posts";
import { pageAlternates } from "@/lib/metadata";

const t = getDictionary("pt-br");

export const metadata: Metadata = {
  title: t.about.title,
  description: getAbout("pt-br").headline,
  alternates: pageAlternates("pt-br", "/about/"),
};

export default function Page() {
  return <AboutPage locale="pt-br" />;
}
