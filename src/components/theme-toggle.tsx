"use client";

import { ThemeToggleButton as BaseThemeToggleButton } from "@carneirofc/ui";
import type {
  ThemeMode,
  ThemeToggleButtonProps as BaseThemeToggleButtonProps,
} from "@carneirofc/ui";

import { THEME_COOKIE, THEME_COOKIE_PATTERN, themeSchema } from "@/lib/theme";

const THEME_COOKIE_RE = new RegExp(THEME_COOKIE_PATTERN);

function readTheme(): ThemeMode | null {
  try {
    const parsed = themeSchema.safeParse(document.cookie.match(THEME_COOKIE_RE)?.[1]);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeTheme(theme: ThemeMode) {
  try {
    document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {
    // best-effort
  }
}

type ThemeToggleProps = Omit<BaseThemeToggleButtonProps, "readTheme" | "writeTheme">;

export function ThemeToggle(props: ThemeToggleProps) {
  return <BaseThemeToggleButton readTheme={readTheme} writeTheme={writeTheme} {...props} />;
}
