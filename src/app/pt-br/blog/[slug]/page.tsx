import type { Metadata } from "next";
import { BlogPostPage, postMetadata, postStaticParams } from "@/components/pages/blog-post-page";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return postStaticParams("pt-br");
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  return postMetadata("pt-br", slug);
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return <BlogPostPage locale="pt-br" slug={slug} />;
}
