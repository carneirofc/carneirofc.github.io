import type { Metadata } from "next";
import { ProjectsPage } from "@/components/pages/projects-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const t = getDictionary("pt-br");

export const metadata: Metadata = pageMetadata("pt-br", "/projects/", {
  title: t.projects.title,
  description: t.projects.description,
});

export default function Page() {
  return <ProjectsPage locale="pt-br" />;
}
