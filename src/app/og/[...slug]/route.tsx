import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getAbout } from "@/lib/posts";
import { getDictionary } from "@/lib/i18n";
import { OG_SIZE, allOgCards, findOgCard, ogCardUrl, ogSlug, type OgCard } from "@/lib/og";

// One social card per page, written to out/og/<locale>/<path>/card.png by the
// static export. See src/lib/og.ts for the registry.

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string[] };

export function generateStaticParams(): Params[] {
  return allOgCards().map((card) => ({ slug: ogSlug(card) }));
}

// Satori reads TTF/OTF/WOFF (not WOFF2). Static latin instances of the site's
// two families, vendored with their OFL licences in assets/fonts/.
const FONT_DIR = join(process.cwd(), "assets", "fonts");
const fonts = Promise.all([
  readFile(join(FONT_DIR, "sora-latin-400-normal.woff")),
  readFile(join(FONT_DIR, "sora-latin-600-normal.woff")),
  readFile(join(FONT_DIR, "ibm-plex-mono-latin-500-normal.woff")),
]).then(([sora400, sora600, mono500]) => [
  { name: "Sora", data: sora400, weight: 400 as const, style: "normal" as const },
  { name: "Sora", data: sora600, weight: 600 as const, style: "normal" as const },
  { name: "Plex Mono", data: mono500, weight: 500 as const, style: "normal" as const },
]);

// The site's dark palette (globals.css + @carneirofc/ui).
const C = {
  base: "#0a0c13",
  line: "#393f5e",
  text: "#e8ecff",
  title: "#fbfdff",
  muted: "#a0a8ce",
  cyan: "#24d7ff",
  pink: "#ff59dd",
  // The eyebrow's cyan/pink mix (page-header.tsx), resolved for Satori.
  eyebrow: "#879ef0",
  mark: "#b09aff",
};

const clamp = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

function Card({ card }: { card: OgCard }) {
  const about = getAbout(card.locale);
  const tagline = getDictionary(card.locale).site.tagline;
  const long = card.title.length > 40;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px 60px",
        backgroundColor: C.base,
        backgroundImage: `radial-gradient(circle at 92% 8%, ${C.cyan}33, transparent 45%), radial-gradient(circle at 4% 100%, ${C.pink}2b, transparent 42%)`,
        color: C.text,
        fontFamily: "Sora",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 8,
          backgroundImage: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            fontFamily: "Plex Mono",
            fontSize: 26,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: C.eyebrow,
          }}
        >
          {card.eyebrow}
        </div>
        <div
          style={{
            fontSize: long ? 60 : 76,
            fontWeight: 600,
            lineHeight: 1.1,
            color: C.title,
            maxWidth: 1000,
          }}
        >
          {clamp(card.title, 90)}
        </div>
        {card.description && (
          <div style={{ fontSize: 30, lineHeight: 1.45, color: C.muted, maxWidth: 980 }}>
            {clamp(card.description, long ? 130 : 230)}
          </div>
        )}
        {card.meta && (
          <div
            style={{
              display: "flex",
              gap: 22,
              fontFamily: "Plex Mono",
              fontSize: 24,
              color: C.cyan,
            }}
          >
            {card.meta.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${C.line}`,
          paddingTop: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 14,
              border: `2px solid ${C.line}`,
              fontFamily: "Plex Mono",
              fontSize: 30,
              color: C.mark,
            }}
          >
            cc
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: C.title }}>{about.name}</div>
            <div style={{ fontFamily: "Plex Mono", fontSize: 20, color: C.muted }}>{tagline}</div>
          </div>
        </div>
        <div style={{ fontFamily: "Plex Mono", fontSize: 20, color: C.muted }}>
          {ogCardUrl(card)}
        </div>
      </div>
    </div>
  );
}

export async function GET(_request: Request, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const card = findOgCard(slug);
  if (!card) return new Response("Not found", { status: 404 });
  return new ImageResponse(<Card card={card} />, { ...OG_SIZE, fonts: await fonts });
}
