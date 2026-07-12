import { LuArrowUpRight } from "react-icons/lu";
import { OutlineButton, PageHeader, SurfacePanel } from "@carneirofc/ui";
import { getDictionary, type Locale } from "@/lib/i18n";

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
          <SurfacePanel key={project.name} tone="soft" padding="lg">
            <div className="flex h-full flex-col gap-3">
              <h2 className="cyber-title text-ui-lg font-semibold">{project.name}</h2>
              <p className="cyber-muted flex-1 text-ui-sm">{project.description}</p>
              <div>
                <OutlineButton asChild controlSize="sm">
                  <a href={project.href} target="_blank" rel="noopener noreferrer">
                    {project.linkLabel}
                    <LuArrowUpRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </OutlineButton>
              </div>
            </div>
          </SurfacePanel>
        ))}
      </div>
    </div>
  );
}
