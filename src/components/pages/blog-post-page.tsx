import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon, InfoChip } from "@carneirofc/ui";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import {
  formatDate,
  getAllPosts,
  getPostBySlug,
  getTranslation,
  readingTimeMinutes,
} from "@/lib/posts";
import { MDXContent } from "@/components/mdx-content";
import { MetaDot } from "@/components/post-card";

export function postStaticParams(locale: Locale): { slug: string }[] {
  return getAllPosts(locale).map((post) => ({ slug: post.slug }));
}

export function postMetadata(locale: Locale, slug: string): Metadata {
  const post = getPostBySlug(locale, slug);
  if (!post) return {};
  const translation = getTranslation(post);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: post.permalink,
      ...(translation && {
        languages: {
          en: localePath("en", `/blog/${slug}/`),
          "pt-BR": localePath("pt-br", `/blog/${slug}/`),
        },
      }),
    },
    openGraph: {
      type: "article",
      url: post.permalink,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      tags: post.tags,
      locale: locale === "en" ? "en_US" : "pt_BR",
    },
  };
}

export function BlogPostPage({ locale, slug }: { locale: Locale; slug: string }) {
  const t = getDictionary(locale);
  const post = getPostBySlug(locale, slug);
  if (!post) notFound();

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="cyber-muted text-ui-xs uppercase tracking-[0.24em]">
          <Link
            href={localePath(locale, "/blog/")}
            className="focus-ring rounded-md hover:text-text"
          >
            {t.blog.subtitle}
          </Link>
        </p>
        <h1 className="cyber-title text-ui-display font-semibold">{post.title}</h1>
        <div className="cyber-muted flex flex-wrap items-center gap-2 text-ui-sm">
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
          <MetaDot />
          <span>{t.blog.minRead(readingTimeMinutes(post.metadata.readingTime))}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={localePath(locale, `/blog/tags/${tag}/`)}
                className="focus-ring rounded-full"
              >
                <InfoChip>#{tag}</InfoChip>
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="prose max-w-none">
        <MDXContent code={post.content} />
      </div>

      <footer className="border-t border-line/80 pt-6">
        <Link
          href={localePath(locale, "/blog/")}
          className="focus-ring cyber-muted inline-flex items-center gap-1 rounded-md text-ui-sm hover:text-text"
        >
          <ChevronLeftIcon aria-hidden className="h-3.5 w-3.5" />
          {t.blog.backToAll}
        </Link>
      </footer>
    </article>
  );
}
