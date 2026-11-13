import { getDictionary, htmlLang, localePath, type Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/metadata";
import { getAbout, type Post } from "@/lib/posts";

// schema.org JSON-LD for search engines. The Person and the WebSite get stable
// `@id`s so every page's graph points at the same two nodes instead of
// describing a new person each time — English and Portuguese pages included.

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const CONTEXT = "https://schema.org";

const absolute = (path: string) => `${SITE_URL}${path}`;

function person(locale: Locale) {
  const about = getAbout(locale);
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: about.name,
    url: absolute("/"),
    jobTitle: getDictionary(locale).site.tagline,
    description: about.headline,
    homeLocation: { "@type": "Country", name: about.location },
    sameAs: [about.links.github, about.links.linkedin],
    knowsAbout: [...new Set(Object.values(about.skills).flat())],
  };
}

function website(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absolute("/"),
    name: "carneirofc.github.io",
    inLanguage: htmlLang[locale],
    author: { "@id": PERSON_ID },
  };
}

/** Home: the site and the person behind it. */
export function homeJsonLd(locale: Locale) {
  return { "@context": CONTEXT, "@graph": [website(locale), person(locale)] };
}

/** About: a ProfilePage whose subject is the person. */
export function aboutJsonLd(locale: Locale) {
  return {
    "@context": CONTEXT,
    "@type": "ProfilePage",
    url: absolute(localePath(locale, "/about/")),
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: person(locale),
  };
}

/** A blog post; `image` is its social card, when there is one. */
export function postJsonLd(post: Post, image?: string) {
  const about = getAbout(post.locale);
  return {
    "@context": CONTEXT,
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: htmlLang[post.locale],
    url: absolute(post.permalink),
    mainEntityOfPage: absolute(post.permalink),
    ...(image && { image: absolute(image) }),
    keywords: post.tags,
    author: { "@type": "Person", "@id": PERSON_ID, name: about.name, url: absolute("/") },
    isPartOf: { "@id": WEBSITE_ID },
  };
}
