import { cn } from "@/lib/ui";

/** Separator dot between inline meta items (date · reading time, place · role). */
export function MetaDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-1 w-1 rounded-full bg-current opacity-60", className)}
    />
  );
}
