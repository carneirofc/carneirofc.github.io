import Link from "next/link";
import { LuChevronLeft } from "react-icons/lu";
import { PageHeader } from "@/components/page-header";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";

export function NotFoundPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        subtitle={t.notFound.subtitle}
        title={t.notFound.title}
        description={t.notFound.description}
      />
      <Link
        href={localePath(locale, "/")}
        className="focus-ring cyber-muted inline-flex items-center gap-1 rounded-md text-ui-sm hover:text-text"
      >
        <LuChevronLeft aria-hidden className="h-3.5 w-3.5" />
        {t.notFound.home}
      </Link>
    </div>
  );
}
