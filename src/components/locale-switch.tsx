"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLanguages } from "react-icons/lu";
import { alternatePath, htmlLang } from "@/lib/locale";

/**
 * Links to the same page in the other locale. Every route exists in both
 * locales, so the mapping is a pure path transformation. The labels come from
 * the server so the dictionaries stay out of the client bundle.
 */
export function LocaleSwitch({ label, ariaLabel }: { label: string; ariaLabel: string }) {
  const pathname = usePathname() ?? "/";
  const target = alternatePath(pathname);

  return (
    <Link
      href={target.path}
      className="focus-ring cyber-muted inline-flex items-center gap-1.5 rounded-md text-ui-sm transition-colors hover:text-text"
      aria-label={ariaLabel}
      hrefLang={htmlLang[target.locale]}
    >
      <LuLanguages aria-hidden className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
