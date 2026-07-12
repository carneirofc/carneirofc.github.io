import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home-page";
import { pageAlternates } from "@/lib/metadata";

export const metadata: Metadata = {
  alternates: pageAlternates("en", "/"),
};

export default function Page() {
  return <HomePage locale="en" />;
}
