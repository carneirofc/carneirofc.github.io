"use client";

import { useEffect, useRef, useState } from "react";
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
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);

  // Track the active button's box so the accent bar can slide between items.
  useEffect(() => {
    const element = itemRefs.current[active];
    if (element) setIndicator({ top: element.offsetTop, height: element.offsetHeight });
  }, [active, items]);

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
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2.5 w-0.5 rounded-full bg-accent transition-all duration-300 ease-out motion-reduce:transition-none"
        style={
          indicator ? { top: indicator.top, height: indicator.height, opacity: 1 } : { opacity: 0 }
        }
      />
      {items.map((item, index) => {
        const Icon = ICONS[item.icon];
        const isActive = active === item.href;
        return (
          <a
            key={item.href}
            ref={(node) => {
              itemRefs.current[item.href] = node;
            }}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            onClick={(event) => handleClick(event, item.href)}
            style={{ animationDelay: `${index * 70}ms` }}
            className={`rail-item focus-ring inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-ui-sm transition duration-200 ease-out hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:hover:translate-x-0 ${
              isActive
                ? "translate-x-0.5 border-line/80 bg-surface/80 text-text backdrop-blur motion-reduce:translate-x-0"
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
