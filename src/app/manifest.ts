import type { MetadataRoute } from "next";
import { getAbout } from "@/lib/posts";

export const dynamic = "force-static";

// Not an installable app — the manifest exists so platforms that read one
// (Android home-screen shortcuts, some link previews) get the icon set, name
// and colours instead of guessing. English: it is one file for both locales.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: getAbout("en").name,
    short_name: "carneirofc",
    start_url: "/",
    display: "browser",
    background_color: "#0a0c13",
    theme_color: "#0a0c13",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
