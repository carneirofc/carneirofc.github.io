import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";
import { getDictionary } from "@/lib/i18n";
import { pageAlternates } from "@/lib/metadata";

const t = getDictionary("pt-br");

export const metadata: Metadata = {
  title: t.contact.title,
  description: t.contact.description,
  alternates: pageAlternates("pt-br", "/contact/"),
};

export default function Page() {
  return <ContactPage locale="pt-br" />;
}
