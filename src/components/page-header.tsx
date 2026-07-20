import type { ReactNode } from "react";

export function PageHeader({
  subtitle,
  title,
  description,
  pills,
}: {
  subtitle: string;
  title: string;
  description: string;
  pills?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
      <div>
        <p className="text-ui-xs uppercase tracking-[0.24em] text-[color:color-mix(in_oklab,var(--accent-cyan)_55%,var(--accent-pink)_45%)]">
          {subtitle}
        </p>
        <h1 className="cyber-title mt-2 text-ui-display font-semibold">{title}</h1>
        <p className="cyber-muted mt-2 max-w-3xl text-ui-md">{description}</p>
      </div>
      {pills && (
        <div className="cyber-muted flex flex-wrap items-center gap-2 text-ui-sm">{pills}</div>
      )}
    </header>
  );
}
