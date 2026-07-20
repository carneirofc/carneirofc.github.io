import { PageHeader } from "@/components/page-header";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ProjectCard } from "@/components/project-card";

export function ProjectsPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        subtitle={t.projects.subtitle}
        title={t.projects.title}
        description={t.projects.description}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {t.projects.entries.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
