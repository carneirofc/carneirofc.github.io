"use client";

import { ThemeToggleButton as BaseThemeToggleButton } from "@carneirofc/ui";
import { z } from "zod";
import type {
  ThemeMode,
  ThemeToggleButtonProps as BaseThemeToggleButtonProps,
} from "@carneirofc/ui";

const THEME_COOKIE = "carneirofc-theme";
const THEME_COOKIE_RE = new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`);

const themeSchema = z.enum(["dark", "light"]) satisfies z.ZodType<ThemeMode>;

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
