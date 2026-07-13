import { LuArrowUpRight } from "react-icons/lu";
import { OutlineButton, SurfacePanel } from "@carneirofc/ui";
import type { ProjectEntry } from "@/lib/i18n";

export function ProjectCard({ project }: { project: ProjectEntry }) {
  return (
    <SurfacePanel tone="soft" padding="lg">
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
  );
}
