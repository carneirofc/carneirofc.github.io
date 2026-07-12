import type { Metadata } from "next";
import { OutlineButton, PageHeader, SurfacePanel } from "@carneirofc/ui";
import { about } from "#site/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects and places to find my work.",
};

const PROJECTS = [
  {
    name: "deedlit.dev",
    description:
      "Personal creative space — AI-generated art gallery, book library, and hobby projects. Next.js, self-hosted, powered by the same design system as this site.",
    href: "https://deedlit.dev",
    linkLabel: "Visit deedlit.dev",
  },
  {
    name: "@carneirofc/ui",
    description:
      "The shared React design system behind deedlit.dev and carneirofc.github.io — app-agnostic building blocks, dark/light theming, and a cyber-flavored visual language.",
    href: "https://github.com/carneirofc/deedlit.dev/tree/master/deedlit.dev.ui",
    linkLabel: "Source on GitHub",
  },
  {
    name: "carneirofc.github.io",
    description:
      "This site: Next.js static export, Velite-powered MDX blog, deployed to GitHub Pages with a checks-gated pipeline and privacy-scrubbing git hooks.",
    href: "https://github.com/carneirofc/carneirofc.github.io",
    linkLabel: "Source on GitHub",
  },
  {
    name: "More on GitHub",
    description:
      "Control-system software, CLIs, infrastructure tooling, and experiments in Go, TypeScript, Python, .NET, and C/C++.",
    href: "https://github.com/carneirofc",
    linkLabel: "github.com/carneirofc",
  },
];

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        subtitle="carneirofc // projects"
        title="Projects"
        description={`Selected work and side projects. The rest lives at ${about.links.github.replace("https://", "")}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <SurfacePanel key={project.name} tone="soft" padding="lg">
            <div className="flex h-full flex-col gap-3">
              <h2 className="cyber-title text-ui-lg font-semibold">{project.name}</h2>
              <p className="cyber-muted flex-1 text-ui-sm">{project.description}</p>
              <div>
                <OutlineButton asChild controlSize="sm">
                  <a href={project.href}>{project.linkLabel}</a>
                </OutlineButton>
              </div>
            </div>
          </SurfacePanel>
        ))}
      </div>
    </div>
  );
}
