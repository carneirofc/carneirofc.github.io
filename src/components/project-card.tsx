import { LuArrowUpRight, LuBookOpen } from "react-icons/lu";
import { OutlineButton, SurfacePanel } from "@carneirofc/ui";
import type { ProjectEntry } from "@/lib/i18n";

const LINK_ICON = "h-3.5 w-3.5 shrink-0";

export function ProjectCard({ project }: { project: ProjectEntry }) {
  return (
    <SurfacePanel tone="soft" padding="lg">
      <div className="flex h-full flex-col gap-3">
        <h2 className="cyber-title text-ui-lg font-semibold">{project.name}</h2>
        <p className="cyber-muted flex-1 text-ui-sm">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          <OutlineButton asChild controlSize="sm">
            <a href={project.href} target="_blank" rel="noopener noreferrer">
              {project.linkLabel}
              <LuArrowUpRight aria-hidden className={LINK_ICON} />
            </a>
          </OutlineButton>
          {project.docsHref && (
            <OutlineButton asChild variant="accent" controlSize="sm">
              <a href={project.docsHref} target="_blank" rel="noopener noreferrer">
                <LuBookOpen aria-hidden className={LINK_ICON} />
                {project.docsLabel}
              </a>
            </OutlineButton>
          )}
        </div>
      </div>
    </SurfacePanel>
  );
}
