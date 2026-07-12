"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLanguages } from "react-icons/lu";
import { alternatePath } from "@/lib/i18n";

/**
 * Links to the same page in the other locale. Every route exists in both
 * locales, so the mapping is a pure path transformation.
 */
export function LocaleSwitch() {
  const pathname = usePathname() ?? "/";
  const target = alternatePath(pathname);
  const label = target.locale === "pt-br" ? "PT-BR" : "EN";

  return (
    <Link
      href={target.path}
      className="focus-ring cyber-muted inline-flex items-center gap-1.5 rounded-md text-ui-sm transition-colors hover:text-text"
      aria-label={target.locale === "pt-br" ? "Ler em português" : "Read in English"}
    >
      <LuLanguages aria-hidden className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
