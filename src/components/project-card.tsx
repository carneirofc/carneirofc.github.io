import { LuArrowUpRight, LuBookOpen } from "react-icons/lu";
import { RepoStats } from "@/components/repo-stats";
import { SurfacePanel } from "@/components/surface-panel";
import { repoFromHref } from "@/lib/github";
import { buttonClass } from "@/lib/ui";
import { getDictionary, type Locale, type ProjectEntry } from "@/lib/i18n";

const LINK_ICON = "h-3.5 w-3.5 shrink-0";

export function ProjectCard({ project, locale }: { project: ProjectEntry; locale: Locale }) {
  const repo = repoFromHref(project.href);
  return (
    <SurfacePanel>
      <div className="flex h-full flex-col gap-3">
        <h2 className="cyber-title text-ui-lg font-semibold">{project.name}</h2>
        <p className="cyber-muted flex-1 text-ui-sm">{project.description}</p>
        {repo && (
          <RepoStats repo={repo} locale={locale} labels={getDictionary(locale).projects.stats} />
        )}
        <div className="flex flex-wrap gap-2">
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("neutral", "sm")}
          >
            {project.linkLabel}
            <LuArrowUpRight aria-hidden className={LINK_ICON} />
          </a>
          {project.docsHref && (
            <a
              href={project.docsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("accent", "sm")}
            >
              <LuBookOpen aria-hidden className={LINK_ICON} />
              {project.docsLabel}
            </a>
          )}
        </div>
      </div>
    </SurfacePanel>
  );
}
