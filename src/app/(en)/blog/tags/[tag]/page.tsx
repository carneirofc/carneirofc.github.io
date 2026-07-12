import type { Metadata } from "next";
import { BlogTagPage, tagMetadata, tagStaticParams } from "@/components/pages/blog-tag-page";

type Params = { tag: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return tagStaticParams("en");
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag } = await params;
  return tagMetadata("en", tag);
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { tag } = await params;
  return <BlogTagPage locale="en" tag={tag} />;
}
