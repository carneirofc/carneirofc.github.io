import type { Metadata } from "next";
import { ProjectsPage } from "@/components/pages/projects-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const t = getDictionary("en");

export const metadata: Metadata = pageMetadata("en", "/projects/", {
  title: t.projects.title,
  description: t.projects.description,
});

export default function Page() {
  return <ProjectsPage locale="en" />;
}
