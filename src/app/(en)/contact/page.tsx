import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact-page";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

const t = getDictionary("en");

export const metadata: Metadata = pageMetadata("en", "/contact/", {
  title: t.contact.title,
  description: t.contact.description,
});

export default function Page() {
  return <ContactPage locale="en" />;
}
