import type { IconType } from "react-icons";
import { LuFolderGit2, LuHouse, LuNewspaper, LuUser, LuWrench } from "react-icons/lu";

const ICONS: Record<string, IconType> = {
  home: LuHouse,
  about: LuUser,
  posts: LuNewspaper,
  projects: LuFolderGit2,
  skills: LuWrench,
};

export type SectionNavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
};

/**
 * Fixed left-side rail mapping the page sections. Plain anchors — scrolling is
 * native (`scroll-behavior: smooth` plus `.section-anchor`'s scroll-margin, see
 * globals.css); there is no active-section tracking. Hidden below xl so it
 * never overlaps the content column.
 */
export function SectionNav({ items, ariaLabel }: { items: SectionNavItem[]; ariaLabel: string }) {
  return (
    <nav
      aria-label={ariaLabel}
      className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex"
    >
      {items.map((item, index) => {
        const Icon = ICONS[item.icon];
        return (
          <a
            key={item.href}
            href={item.href}
            style={{ animationDelay: `${index * 70}ms` }}
            className="rail-item focus-ring inline-flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-ui-sm text-muted transition duration-200 ease-out hover:translate-x-0.5 hover:text-text motion-reduce:transition-none motion-reduce:hover:translate-x-0"
          >
            <Icon aria-hidden className="h-4 w-4 shrink-0" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
