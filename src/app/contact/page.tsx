import type { Metadata } from "next";
import { OutlineButton, PageHeader, SectionLabel, SurfacePanel } from "@carneirofc/ui";
import { about } from "#site/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach Cláudio Carneiro — email, GitHub, LinkedIn.",
};

export default function ContactPage() {
  const channels = [
    {
      label: "Email",
      value: about.email,
      href: `mailto:${about.email}`,
      cta: "Write me",
    },
    {
      label: "GitHub",
      value: about.links.github.replace("https://", ""),
      href: about.links.github,
      cta: "Follow",
    },
    {
      label: "LinkedIn",
      value: "Cláudio Carneiro",
      href: about.links.linkedin,
      cta: "Connect",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        subtitle="carneirofc // contact"
        title="Contact"
        description="The fastest way to reach me is email. For code, issues, and PRs, GitHub works best."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {channels.map((channel) => (
          <SurfacePanel key={channel.label} tone="soft" padding="lg">
            <div className="flex h-full flex-col gap-3">
              <SectionLabel>{channel.label}</SectionLabel>
              <p className="cyber-title flex-1 break-words text-ui-sm font-medium">
                {channel.value}
              </p>
              <div>
                <OutlineButton asChild controlSize="sm">
                  <a href={channel.href}>{channel.cta}</a>
                </OutlineButton>
              </div>
            </div>
          </SurfacePanel>
        ))}
      </div>
    </div>
  );
}
