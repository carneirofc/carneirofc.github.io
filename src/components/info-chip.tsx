import type { ReactNode } from "react";
import { cn } from "@/lib/ui";

export function InfoChip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("cyber-chip rounded-full px-3 py-1", className)}>{children}</span>;
}
