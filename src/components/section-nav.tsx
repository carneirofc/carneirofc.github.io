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

// Vanilla-JS island: active-section tracking (IntersectionObserver), smooth
// scroll on click, and the sliding indicator bar all run from this one
// inline script instead of a React client component, so the rail costs no
// hydration on any page that renders it.
const SECTION_NAV_SCRIPT = `
(() => {
  try {
    const ACTIVE = ["translate-x-0.5", "border-line/80", "bg-surface/80", "text-text", "backdrop-blur"];
    const INACTIVE = ["border-transparent", "text-muted"];
    const SCROLL_OFFSET = 100;

    function setup(nav) {
      const links = Array.from(nav.querySelectorAll("[data-section-nav-link]"));
      const indicator = nav.querySelector("[data-section-nav-indicator]");
      let active = links[0] || null;

      function updateIndicator() {
        if (!indicator || !active) return;
        indicator.style.top = active.offsetTop + "px";
        indicator.style.height = active.offsetHeight + "px";
        indicator.style.opacity = "1";
      }

      function setActive(link) {
        if (active === link) return;
        if (active) {
          active.classList.remove(...ACTIVE);
          active.classList.add(...INACTIVE);
          active.removeAttribute("aria-current");
        }
        link.classList.remove(...INACTIVE);
        link.classList.add(...ACTIVE);
        link.setAttribute("aria-current", "true");
        active = link;
        updateIndicator();
      }

      links.forEach((link) => {
        link.addEventListener("click", (event) => {
          const id = link.getAttribute("data-target");
          const el = id ? document.getElementById(id) : null;
          if (!el) return;
          event.preventDefault();
          const top = el.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
          window.scrollTo({ top, behavior: "smooth" });
          setActive(link);
        });
      });

      const targets = links
        .map((link) => document.getElementById(link.getAttribute("data-target") || ""))
        .filter(Boolean);

      if (targets.length && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const link = links.find((l) => l.getAttribute("data-target") === entry.target.id);
                if (link) setActive(link);
              }
            }
          },
          { rootMargin: "-20% 0px -70% 0px" },
        );
        targets.forEach((target) => observer.observe(target));
      }

      updateIndicator();
    }

    document.querySelectorAll("[data-section-nav]").forEach(setup);
  } catch {}
})();
`;

/**
 * Fixed left-side rail that maps the page sections and smooth-scrolls to
 * them; the section in view is highlighted. Hidden below xl so it never
 * overlaps the content column.
 */
export function SectionNav({ items, ariaLabel }: { items: SectionNavItem[]; ariaLabel: string }) {
  return (
    <>
      <nav
        aria-label={ariaLabel}
        data-section-nav
        className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex"
      >
        <span
          aria-hidden
          data-section-nav-indicator
          className="pointer-events-none absolute -left-2.5 w-0.5 rounded-full bg-accent opacity-0 transition-all duration-300 ease-out motion-reduce:transition-none"
        />
        {items.map((item, index) => {
          const Icon = ICONS[item.icon];
          const isFirst = index === 0;
          return (
            <a
              key={item.href}
              href={item.href}
              data-section-nav-link
              data-target={item.href.replace("#", "")}
              aria-current={isFirst ? "true" : undefined}
              style={{ animationDelay: `${index * 70}ms` }}
              className={`rail-item focus-ring inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-ui-sm transition duration-200 ease-out hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:aria-[current=true]:translate-x-0 ${
                isFirst
                  ? "translate-x-0.5 border-line/80 bg-surface/80 text-text backdrop-blur"
                  : "border-transparent text-muted hover:text-text"
              }`}
            >
              <Icon aria-hidden className="h-4 w-4 shrink-0" />
              {item.label}
            </a>
          );
        })}
      </nav>
      <script dangerouslySetInnerHTML={{ __html: SECTION_NAV_SCRIPT }} />
    </>
  );
}
