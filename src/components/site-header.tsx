import Link from "next/link";

const NAV = [
  { href: "/", label: "home" },
  { href: "/blog/", label: "blog" },
  { href: "/projects/", label: "projects" },
  { href: "/contact/", label: "contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring cyber-title rounded-md text-ui-md font-semibold">
          carneirofc
        </Link>
        <nav className="flex items-center gap-4 text-ui-sm sm:gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring cyber-muted rounded-md transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
