import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/blog-index-page";
import { getDictionary } from "@/lib/i18n";
import { pageAlternates } from "@/lib/metadata";

const t = getDictionary("pt-br");

export const metadata: Metadata = {
  title: t.blog.title,
  description: t.blog.description,
  alternates: pageAlternates("pt-br", "/blog/"),
};

export default function Page() {
  return <BlogIndexPage locale="pt-br" />;
}
