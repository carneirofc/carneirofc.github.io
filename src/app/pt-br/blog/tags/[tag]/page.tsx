import type { Metadata } from "next";
import { BlogTagPage, tagMetadata, tagStaticParams } from "@/components/pages/blog-tag-page";

type Params = { tag: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return tagStaticParams("pt-br");
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag } = await params;
  return tagMetadata("pt-br", tag);
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { tag } = await params;
  return <BlogTagPage locale="pt-br" tag={tag} />;
}
