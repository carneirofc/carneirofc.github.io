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

export type ProjectEntry = {
  name: string;
  description: string;
  href: string;
  linkLabel: string;
  docsHref?: string;
  docsLabel?: string;
};

export type Dictionary = {
  nav: { home: string; about: string; blog: string; projects: string; contact: string };
  home: {
    subtitle: string;
    aboutMe: string;
    latestPosts: string;
    allPosts: string;
    featuredProjects: string;
    allProjects: string;
    email: string;
    sectionsAriaLabel: string;
    sections: { intro: string; posts: string; projects: string };
  };
  about: {
    subtitle: string;
    title: string;
    sectionsAriaLabel: string;
    sections: { bio: string; skills: string };
    skills: Record<"languages" | "web" | "platform" | "devsecops" | "cloud" | "data_ai", string>;
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
    nav: { home: "home", about: "about", blog: "blog", projects: "projects", contact: "contact" },
    home: {
      subtitle: "carneirofc // home",
      aboutMe: "About me",
      latestPosts: "Latest posts",
      allPosts: "all posts",
      featuredProjects: "Projects",
      allProjects: "all projects",
      email: "Email",
      sectionsAriaLabel: "Page sections",
      sections: { intro: "Intro", posts: "Posts", projects: "Projects" },
    },
    about: {
      subtitle: "carneirofc // about",
      title: "About",
      sectionsAriaLabel: "Page sections",
      sections: { bio: "About", skills: "Skills" },
      skills: {
        languages: "Languages",
        web: "Web & Frameworks",
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
            "My personal creative space — an AI-art gallery, a book library, and hobby projects. Next.js, self-hosted, running the same design system as this site.",
          href: "https://github.com/carneirofc/deedlit.dev",
          linkLabel: "Source on GitHub",
          docsHref: "https://carneirofc.github.io/deedlit.dev/",
          docsLabel: "Docs",
        },
        {
          name: "@carneirofc/ui",
          description:
            "The React design system I share between deedlit.dev and this site — app-agnostic building blocks, dark/light theming, and a cyber-flavored look.",
          href: "https://github.com/carneirofc/deedlit.dev/tree/master/deedlit.dev.ui",
          linkLabel: "Source on GitHub",
          docsHref: "https://carneirofc.github.io/deedlit.dev/ui/storybook/",
          docsLabel: "Storybook",
        },
        {
          name: "carneirofc.github.io",
          description:
            "This very site. A Next.js static export with a Velite-powered MDX blog, deployed to GitHub Pages through a checks-gated pipeline and privacy-scrubbing git hooks.",
          href: "https://github.com/carneirofc/carneirofc.github.io",
          linkLabel: "Source on GitHub",
        },
        {
          name: "magi",
          description:
            "My personal AI assistant framework — one shared agent brain, many channels (Discord, an HTTP API, a desktop app), all driving the same stack. Model-agnostic, with memory it writes on purpose. Built on Agno, shipped to PyPI.",
          href: "https://github.com/carneirofc/magi-ai-assistant",
          linkLabel: "Source on GitHub",
        },
        {
          name: "Alyssa",
          description:
            "My AI assistant, built on top of the magi framework. She's a persona with a point of view — dryly warm, leads with the answer, and tells you when she doesn't know something.",
          href: "https://github.com/carneirofc/alyssa",
          linkLabel: "Source on GitHub",
        },
        {
          name: "Qt Task Manager",
          description:
            "A desktop task manager I built for Windows in PySide6 — live processes and connections, plus read-only scanners for disk cleanup, registry hygiene, and threat heuristics. It even exposes an optional MCP server so an AI can read the machine's live metrics.",
          href: "https://github.com/carneirofc/qttaskmanager",
          linkLabel: "Source on GitHub",
          docsHref: "https://carneirofc.github.io/qttaskmanager/",
          docsLabel: "Docs",
        },
        {
          name: "devops-utils",
          description:
            "A Python toolbox for the DevOps chores I keep repeating — Kubernetes secret sanitizing, Azure DevOps work items, and more. A dependency-free core wrapped in whichever surface fits: CLI, Textual TUI, PySide6 UI, MCP server, or a Claude Code plugin. Published on PyPI.",
          href: "https://github.com/carneirofc/devops-utils",
          linkLabel: "Source on GitHub",
          docsHref: "https://carneirofc.github.io/devops-utils/",
          docsLabel: "Docs",
        },
        {
          name: "Local LLM Translate",
          description:
            "A browser extension that translates pages against a llama-server running on your own machine — nothing is sent to a cloud API. Visible text and headings go first, with an optional local cache. A hard fork of Eldoprano's offline-browser-translate, on my own roadmap.",
          href: "https://github.com/carneirofc/offline-browser-translate",
          linkLabel: "Source on GitHub",
          docsHref: "https://addons.mozilla.org/en-GB/firefox/addon/local-llm-translator/",
          docsLabel: "Firefox add-on",
        },
        {
          name: "2D game experiments",
          description:
            "Me learning game development from scratch — a C++23 sidescroller on raylib, no engine. A data-oriented world, generational entity handles, spatial-grid collision, and a lot of squash-&-stretch juice. Mostly for the fun of it.",
          href: "https://github.com/carneirofc/raylib-2d-game-experiments",
          linkLabel: "Source on GitHub",
        },
        {
          name: "More on GitHub",
          description:
            "The rest of what I tinker with — control-system software, CLIs, infra tooling, and experiments in Go, TypeScript, Python, .NET, and C/C++.",
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
    nav: { home: "início", about: "sobre", blog: "blog", projects: "projetos", contact: "contato" },
    home: {
      subtitle: "carneirofc // início",
      aboutMe: "Sobre mim",
      latestPosts: "Últimos posts",
      allPosts: "todos os posts",
      featuredProjects: "Projetos",
      allProjects: "todos os projetos",
      email: "E-mail",
      sectionsAriaLabel: "Seções da página",
      sections: { intro: "Introdução", posts: "Posts", projects: "Projetos" },
    },
    about: {
      subtitle: "carneirofc // sobre",
      title: "Sobre",
      sectionsAriaLabel: "Seções da página",
      sections: { bio: "Sobre", skills: "Competências" },
      skills: {
        languages: "Linguagens",
        web: "Web & Frameworks",
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
            "Meu espaço criativo pessoal — uma galeria de arte gerada por IA, uma biblioteca de livros e projetos de hobby. Next.js, self-hosted, rodando o mesmo design system deste site.",
          href: "https://github.com/carneirofc/deedlit.dev",
          linkLabel: "Código no GitHub",
          docsHref: "https://carneirofc.github.io/deedlit.dev/",
          docsLabel: "Docs",
        },
        {
          name: "@carneirofc/ui",
          description:
            "O design system React que eu compartilho entre o deedlit.dev e este site — blocos agnósticos de aplicação, temas claro/escuro e um visual cyber.",
          href: "https://github.com/carneirofc/deedlit.dev/tree/master/deedlit.dev.ui",
          linkLabel: "Código no GitHub",
          docsHref: "https://carneirofc.github.io/deedlit.dev/ui/storybook/",
          docsLabel: "Storybook",
        },
        {
          name: "carneirofc.github.io",
          description:
            "Este site aqui mesmo. Um export estático de Next.js com blog MDX via Velite, publicado no GitHub Pages por um pipeline de checks obrigatórios e hooks de git que removem metadados de mídia.",
          href: "https://github.com/carneirofc/carneirofc.github.io",
          linkLabel: "Código no GitHub",
        },
        {
          name: "magi",
          description:
            "Meu framework de assistente de IA pessoal — um cérebro de agente compartilhado e vários canais (Discord, uma API HTTP, um app desktop), todos usando o mesmo stack. Agnóstico de modelo, com memória que ele escreve de propósito. Construído sobre o Agno, publicado no PyPI.",
          href: "https://github.com/carneirofc/magi-ai-assistant",
          linkLabel: "Código no GitHub",
        },
        {
          name: "Alyssa",
          description:
            "Minha assistente de IA, construída sobre o framework magi. Ela é uma persona com opinião própria — de humor seco e acolhedor, entrega a resposta primeiro e avisa quando não sabe de algo.",
          href: "https://github.com/carneirofc/alyssa",
          linkLabel: "Código no GitHub",
        },
        {
          name: "Qt Task Manager",
          description:
            "Um gerenciador de tarefas desktop que fiz para Windows em PySide6 — processos e conexões ao vivo, além de scanners somente-leitura para limpeza de disco, higiene do registro e heurística de ameaças. Ele ainda expõe um servidor MCP opcional para uma IA ler as métricas ao vivo da máquina.",
          href: "https://github.com/carneirofc/qttaskmanager",
          linkLabel: "Código no GitHub",
          docsHref: "https://carneirofc.github.io/qttaskmanager/",
          docsLabel: "Documentação",
        },
        {
          name: "devops-utils",
          description:
            "Uma caixa de ferramentas em Python para as tarefas de DevOps que eu repito sempre — sanitizar secrets de manifestos Kubernetes, work items do Azure DevOps e mais. Um núcleo sem dependências exposto pela superfície que fizer sentido: CLI, TUI em Textual, UI em PySide6, servidor MCP ou plugin do Claude Code. Publicado no PyPI.",
          href: "https://github.com/carneirofc/devops-utils",
          linkLabel: "Código no GitHub",
          docsHref: "https://carneirofc.github.io/devops-utils/",
          docsLabel: "Documentação",
        },
        {
          name: "Local LLM Translate",
          description:
            "Uma extensão de navegador que traduz páginas usando um llama-server rodando na sua própria máquina — nada é enviado para uma API na nuvem. Texto visível e títulos vêm primeiro, com cache local opcional. Um hard fork do offline-browser-translate do Eldoprano, seguindo meu próprio roteiro.",
          href: "https://github.com/carneirofc/offline-browser-translate",
          linkLabel: "Código no GitHub",
          docsHref: "https://addons.mozilla.org/pt-BR/firefox/addon/local-llm-translator/",
          docsLabel: "Extensão para Firefox",
        },
        {
          name: "Experimentos de jogo 2D",
          description:
            "Eu aprendendo desenvolvimento de jogos do zero — um sidescroller em C++23 sobre raylib, sem engine. Um mundo orientado a dados, handles de entidade geracionais, colisão por grade espacial e bastante 'game feel' com squash & stretch. Mais pela diversão.",
          href: "https://github.com/carneirofc/raylib-2d-game-experiments",
          linkLabel: "Código no GitHub",
        },
        {
          name: "Mais no GitHub",
          description:
            "O resto do que eu fuço — software de sistemas de controle, CLIs, ferramentas de infra e experimentos em Go, TypeScript, Python, .NET e C/C++.",
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
