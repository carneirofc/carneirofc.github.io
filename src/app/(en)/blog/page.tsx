import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/blog-index-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const t = getDictionary("en");

export const metadata: Metadata = pageMetadata("en", "/blog/", {
  title: t.blog.title,
  description: t.blog.description,
});

export default function Page() {
  return <BlogIndexPage locale="en" />;
}
