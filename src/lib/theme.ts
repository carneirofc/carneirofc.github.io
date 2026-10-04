import { z } from "zod";
import type { ThemeMode } from "@carneirofc/ui";

export const THEME_COOKIE = "carneirofc-theme";

export const themeSchema = z.enum(["dark", "light"]) satisfies z.ZodType<ThemeMode>;

/** Matches the theme cookie's value; shared by the init script and the toggle. */
export const THEME_COOKIE_PATTERN = `(?:^|; )${THEME_COOKIE}=(${themeSchema.options.join("|")})`;
