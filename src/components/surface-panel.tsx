import type { ReactNode } from "react";
import { cn, SURFACE_PANEL_CLASS } from "@/lib/ui";

export function SurfacePanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(SURFACE_PANEL_CLASS, className)}>{children}</div>;
}
