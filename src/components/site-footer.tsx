import { about } from "#site/content";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-line/80 py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 text-ui-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} {about.name}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a href={about.links.github} className="focus-ring rounded-md hover:text-text">
            GitHub
          </a>
          <a href={about.links.linkedin} className="focus-ring rounded-md hover:text-text">
            LinkedIn
          </a>
          <a href={about.links.projects} className="focus-ring rounded-md hover:text-text">
            deedlit.dev
          </a>
          <a href={`mailto:${about.email}`} className="focus-ring rounded-md hover:text-text">
            {about.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
