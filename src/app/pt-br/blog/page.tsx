import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/blog-index-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const t = getDictionary("pt-br");

export const metadata: Metadata = pageMetadata("pt-br", "/blog/", {
  title: t.blog.title,
  description: t.blog.description,
});

export default function Page() {
  return <BlogIndexPage locale="pt-br" />;
}
