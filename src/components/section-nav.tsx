"use client";

import { useEffect, useState } from "react";
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

const SCROLL_OFFSET = 100;

/**
 * Fixed left-side rail that maps the page sections and smooth-scrolls to
 * them; the section in view is highlighted. Hidden below xl so it never
 * overlaps the content column.
 */
export function SectionNav({ items, ariaLabel }: { items: SectionNavItem[]; ariaLabel: string }) {
  const [active, setActive] = useState(items[0]?.href ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const item of items) {
      const element = document.getElementById(item.href.replace("#", ""));
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const element = document.getElementById(href.replace("#", ""));
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(href);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex"
    >
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        const isActive = active === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            onClick={(event) => handleClick(event, item.href)}
            className={`focus-ring inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-ui-sm transition-colors ${
              isActive
                ? "border-line/80 bg-surface/80 text-text backdrop-blur"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            <Icon aria-hidden className="h-4 w-4 shrink-0" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
