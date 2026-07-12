import type { Metadata } from "next";
import { ProjectsPage } from "@/components/pages/projects-page";
import { getDictionary } from "@/lib/i18n";
import { pageAlternates } from "@/lib/metadata";

const t = getDictionary("pt-br");

export const metadata: Metadata = {
  title: t.projects.title,
  description: t.projects.description,
  alternates: pageAlternates("pt-br", "/projects/"),
};

export default function Page() {
  return <ProjectsPage locale="pt-br" />;
}
