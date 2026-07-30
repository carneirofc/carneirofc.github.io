#!/usr/bin/env node
/**
 * Build gate: every published route must exist in every locale.
 *
 * The header's language switch is a pure path transformation (`alternatePath`
 * in src/lib/i18n.ts) and both `[slug]` routes set `dynamicParams = false`, so
 * a post published in only one language turns that switch into a hard 404.
 * Nothing else catches this — Velite validates one document at a time, and
 * parity is a cross-document invariant.
 *
 * Run after `velite build`; reads the generated .velite/ data.
 */
import { readFileSync } from "node:fs";

const LOCALES = ["en", "pt-br"];

function load(name) {
  try {
    return JSON.parse(readFileSync(new URL(`../.velite/${name}`, import.meta.url), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(
        `check-translations: .velite/${name} not found — run \`npm run velite\` first.`,
      );
      process.exit(1);
    }
    throw error;
  }
}

/** Group entries by `key`, returning the locales each key was found in. */
function localesByKey(entries, key) {
  const found = new Map();
  for (const entry of entries) {
    if (!found.has(entry[key])) found.set(entry[key], new Set());
    found.get(entry[key]).add(entry.locale);
  }
  return found;
}

const gaps = [];

function collectGaps(label, entries, key, fileFor) {
  for (const [id, locales] of localesByKey(entries, key)) {
    const missing = LOCALES.filter((locale) => !locales.has(locale));
    if (missing.length > 0) {
      gaps.push({ label, id, missing, files: missing.map((locale) => fileFor(id, locale)) });
    }
  }
}

// Drafts are excluded from the site, so they are excluded from parity too — but
// a draft translation of a published post still leaves the route missing.
const posts = load("posts.json").filter((post) => !post.draft);
collectGaps("post", posts, "slug", (slug, locale) =>
  locale === "en" ? `content/blog/${slug}.mdx` : `content/blog/${slug}.pt-br.mdx`,
);

// getAbout() falls back to English, so a missing translation degrades quietly
// rather than 404ing — still a bug worth failing on.
const abouts = load("abouts.json").map((about) => ({ ...about, id: "about" }));
collectGaps("about page", abouts, "id", (_id, locale) =>
  locale === "en" ? "content/about.mdx" : "content/about.pt-br.mdx",
);

if (gaps.length > 0) {
  console.error("check-translations: content is missing translations:\n");
  for (const { label, id, missing, files } of gaps) {
    console.error(`  ${label} "${id}" — missing ${missing.join(", ")}`);
    for (const file of files) console.error(`      expected: ${file}`);
  }
  console.error("\nWrite the missing file(s), or mark the whole set `draft: true`.");
  process.exit(1);
}

console.log(
  `check-translations: ${posts.length} published post file(s) and ${abouts.length} about file(s) — all locales present.`,
);
