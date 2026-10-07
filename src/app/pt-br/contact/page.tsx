import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const t = getDictionary("pt-br");

export const metadata: Metadata = pageMetadata("pt-br", "/contact/", {
  title: t.contact.title,
  description: t.contact.description,
});

export default function Page() {
  return <ContactPage locale="pt-br" />;
}
