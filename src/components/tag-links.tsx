import Link from "next/link";
import { InfoChip } from "@/components/info-chip";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/ui";

/** Tag chips linking to their /blog/tags/[tag]/ page; renders nothing for no tags. */
export function TagLinks({
  locale,
  tags,
  className,
}: {
  locale: Locale;
  tags: { tag: string; count?: number }[];
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map(({ tag, count }) => (
        <Link
          key={tag}
          href={localePath(locale, `/blog/tags/${tag}/`)}
          className="focus-ring rounded-full"
        >
          <InfoChip>
            #{tag}
            {count !== undefined && ` (${count})`}
          </InfoChip>
        </Link>
      ))}
    </div>
  );
}
