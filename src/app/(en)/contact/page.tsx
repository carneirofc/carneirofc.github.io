import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";
import { getDictionary } from "@/lib/i18n";
import { pageAlternates } from "@/lib/metadata";

const t = getDictionary("en");

export const metadata: Metadata = {
  title: t.contact.title,
  description: t.contact.description,
  alternates: pageAlternates("en", "/contact/"),
};

export default function Page() {
  return <ContactPage locale="en" />;
}
