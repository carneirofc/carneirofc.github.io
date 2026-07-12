"use client";

import { ThemeToggleButton as BaseThemeToggleButton } from "@carneirofc/ui";
import type {
  ThemeMode,
  ThemeToggleButtonProps as BaseThemeToggleButtonProps,
} from "@carneirofc/ui";

const THEME_COOKIE = "carneirofc-theme";

function readTheme(): ThemeMode | null {
  try {
    const match = document.cookie.match(/(?:^|; )carneirofc-theme=(dark|light)/);
    return match ? (match[1] as ThemeMode) : null;
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
