export const locales = ["en", "pt-br"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** BCP 47 tag for <html lang> and hreflang alternates. */
export const htmlLang: Record<Locale, string> = {
  en: "en",
  "pt-br": "pt-BR",
};

/** Prefix a site-root path ("/blog/") with the locale segment when needed. */
export function localePath(locale: Locale, path: string): string {
  return locale === "en" ? path : `/pt-br${path}`;
}

/** Map a pathname to its equivalent in the other locale. */
export function alternatePath(pathname: string): { locale: Locale; path: string } {
  if (pathname === "/pt-br" || pathname.startsWith("/pt-br/")) {
    return { locale: "en", path: pathname.replace(/^\/pt-br/, "") || "/" };
  }
  return { locale: "pt-br", path: `/pt-br${pathname === "/" ? "" : pathname}` || "/pt-br" };
}

type ProjectEntry = {
  name: string;
  description: string;
  href: string;
  linkLabel: string;
};

export type Dictionary = {
  nav: { home: string; blog: string; projects: string; contact: string };
  home: {
    subtitle: string;
    latestPosts: string;
    allPosts: string;
    email: string;
    skills: Record<"languages" | "platform" | "devsecops" | "cloud" | "data_ai", string>;
  };
  blog: {
    subtitle: string;
    title: string;
    description: string;
    postSingular: string;
    postPlural: string;
    backToAll: string;
    tagSubtitle: string;
    tagDescription: (tag: string) => string;
    minRead: (minutes: number) => string;
  };
  projects: {
    subtitle: string;
    title: string;
    description: string;
    entries: ProjectEntry[];
  };
  contact: {
    subtitle: string;
    title: string;
    description: string;
    email: { label: string; cta: string };
    github: { label: string; cta: string };
    linkedin: { label: string; cta: string };
  };
  footer: { rightsReserved: string };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: { home: "home", blog: "blog", projects: "projects", contact: "contact" },
    home: {
      subtitle: "carneirofc // about",
      latestPosts: "Latest posts",
      allPosts: "all posts",
      email: "Email",
      skills: {
        languages: "Languages",
        platform: "Platform",
        devsecops: "DevSecOps",
        cloud: "Cloud",
        data_ai: "Data & AI",
      },
    },
    blog: {
      subtitle: "carneirofc // blog",
      title: "Blog",
      description: "Notes on platform engineering, DevSecOps, and building software.",
      postSingular: "post",
      postPlural: "posts",
      backToAll: "back to all posts",
      tagSubtitle: "carneirofc // blog // tags",
      tagDescription: (tag) => `Posts tagged #${tag}.`,
      minRead: (minutes) => `${minutes} min read`,
    },
    projects: {
      subtitle: "carneirofc // projects",
      title: "Projects",
      description: "Selected work and side projects. The rest lives at github.com/carneirofc.",
      entries: [
        {
          name: "deedlit.dev",
          description:
            "Personal creative space — AI-generated art gallery, book library, and hobby projects. Next.js, self-hosted, powered by the same design system as this site.",
          href: "https://deedlit.dev",
          linkLabel: "Visit deedlit.dev",
        },
        {
          name: "@carneirofc/ui",
          description:
            "The shared React design system behind deedlit.dev and carneirofc.github.io — app-agnostic building blocks, dark/light theming, and a cyber-flavored visual language.",
          href: "https://github.com/carneirofc/deedlit.dev/tree/master/deedlit.dev.ui",
          linkLabel: "Source on GitHub",
        },
        {
          name: "carneirofc.github.io",
          description:
            "This site: Next.js static export, Velite-powered MDX blog, deployed to GitHub Pages with a checks-gated pipeline and privacy-scrubbing git hooks.",
          href: "https://github.com/carneirofc/carneirofc.github.io",
          linkLabel: "Source on GitHub",
        },
        {
          name: "More on GitHub",
          description:
            "Control-system software, CLIs, infrastructure tooling, and experiments in Go, TypeScript, Python, .NET, and C/C++.",
          href: "https://github.com/carneirofc",
          linkLabel: "github.com/carneirofc",
        },
      ],
    },
    contact: {
      subtitle: "carneirofc // contact",
      title: "Contact",
      description:
        "The fastest way to reach me is email. For code, issues, and PRs, GitHub works best.",
      email: { label: "Email", cta: "Write me" },
      github: { label: "GitHub", cta: "Follow" },
      linkedin: { label: "LinkedIn", cta: "Connect" },
    },
    footer: { rightsReserved: "All rights reserved." },
  },
  "pt-br": {
    nav: { home: "início", blog: "blog", projects: "projetos", contact: "contato" },
    home: {
      subtitle: "carneirofc // sobre",
      latestPosts: "Últimos posts",
      allPosts: "todos os posts",
      email: "E-mail",
      skills: {
        languages: "Linguagens",
        platform: "Plataforma",
        devsecops: "DevSecOps",
        cloud: "Cloud",
        data_ai: "Dados & IA",
      },
    },
    blog: {
      subtitle: "carneirofc // blog",
      title: "Blog",
      description: "Notas sobre engenharia de plataforma, DevSecOps e construção de software.",
      postSingular: "post",
      postPlural: "posts",
      backToAll: "voltar para todos os posts",
      tagSubtitle: "carneirofc // blog // tags",
      tagDescription: (tag) => `Posts com a tag #${tag}.`,
      minRead: (minutes) => `${minutes} min de leitura`,
    },
    projects: {
      subtitle: "carneirofc // projetos",
      title: "Projetos",
      description:
        "Trabalhos selecionados e projetos paralelos. O resto está em github.com/carneirofc.",
      entries: [
        {
          name: "deedlit.dev",
          description:
            "Espaço criativo pessoal — galeria de arte gerada por IA, biblioteca de livros e projetos de hobby. Next.js, self-hosted, com o mesmo design system deste site.",
          href: "https://deedlit.dev",
          linkLabel: "Visitar deedlit.dev",
        },
        {
          name: "@carneirofc/ui",
          description:
            "O design system React compartilhado por trás do deedlit.dev e do carneirofc.github.io — blocos de construção agnósticos de aplicação, temas claro/escuro e uma linguagem visual cyber.",
          href: "https://github.com/carneirofc/deedlit.dev/tree/master/deedlit.dev.ui",
          linkLabel: "Código no GitHub",
        },
        {
          name: "carneirofc.github.io",
          description:
            "Este site: export estático de Next.js, blog MDX com Velite, publicado no GitHub Pages com pipeline de checks obrigatórios e hooks de git que removem metadados de mídia.",
          href: "https://github.com/carneirofc/carneirofc.github.io",
          linkLabel: "Código no GitHub",
        },
        {
          name: "Mais no GitHub",
          description:
            "Software de sistemas de controle, CLIs, ferramentas de infraestrutura e experimentos em Go, TypeScript, Python, .NET e C/C++.",
          href: "https://github.com/carneirofc",
          linkLabel: "github.com/carneirofc",
        },
      ],
    },
    contact: {
      subtitle: "carneirofc // contato",
      title: "Contato",
      description:
        "O jeito mais rápido de falar comigo é por e-mail. Para código, issues e PRs, o GitHub funciona melhor.",
      email: { label: "E-mail", cta: "Escreva para mim" },
      github: { label: "GitHub", cta: "Seguir" },
      linkedin: { label: "LinkedIn", cta: "Conectar" },
    },
    footer: { rightsReserved: "Todos os direitos reservados." },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
