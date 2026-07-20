import type { ReactNode } from "react";
import { cn } from "@/lib/ui";

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-ui-xs font-semibold uppercase tracking-wide text-[color:var(--ui-ink-secondary)]",
        className,
      )}
    >
      {children}
    </p>
  );
}
