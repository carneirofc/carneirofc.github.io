import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Focus is outline-based (not ring/box-shadow) so it never inherits the
// box-shadow transition — the indicator appears instantly. Each variant
// carries exactly one hover signal: neutral=border, ghost=background,
// accent=shadow (globals.css cancels the package's hover lift).
const BUTTON_BASE =
  "inline-flex cursor-pointer select-none items-center justify-center gap-1 whitespace-nowrap border font-medium leading-none transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ui-ring-focus)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

const BUTTON_VARIANTS = {
  neutral:
    "border-ui-strong bg-panel text-[color:var(--ui-ink-accent)] shadow-[0_10px_24px_-18px_color-mix(in_oklab,var(--ui-border-active)_45%,transparent)] hover:border-ui-active active:bg-[color:var(--ui-bg-active)]",
  ghost:
    "cyber-button-ghost border-ui-strong bg-[color:var(--surface-0)]/55 text-[color:var(--ui-ink)] shadow-[0_10px_24px_-18px_color-mix(in_oklab,var(--ui-border-active)_38%,transparent)] hover:bg-[color:var(--ui-bg-soft)] active:bg-[color:var(--ui-bg-soft)]",
  accent:
    "cyber-button border-transparent text-[color:var(--text-0)] shadow-[0_10px_24px_-18px_color-mix(in_oklab,var(--panel-border-strong)_45%,transparent)] hover:shadow-[0_16px_28px_-20px_color-mix(in_oklab,var(--panel-border-strong)_62%,transparent)] active:bg-[color:color-mix(in_oklab,var(--surface-0)_55%,var(--accent-cyan)_45%)]",
} as const;

const BUTTON_SIZES = {
  sm: "rounded-lg px-3 py-1.5 text-ui-xs",
  md: "rounded-xl px-3 py-2 text-ui-xs",
} as const;

export function buttonClass(
  variant: keyof typeof BUTTON_VARIANTS = "neutral",
  controlSize: keyof typeof BUTTON_SIZES = "sm",
  className?: ClassValue,
) {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[controlSize], className);
}

// Always used at tone="soft" padding="lg" in this site.
export const SURFACE_PANEL_CLASS = "rounded-xl border border-ui bg-panel/90 p-4";
