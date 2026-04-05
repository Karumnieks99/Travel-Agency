import { useEffect } from "react";

export const SITE_NAME = "Surga Indonesia Travel";
export const SITE_DESCRIPTION =
  "Surga Indonesia Travel designs private and small-group Indonesia trips with tailored routes, local logistics, and real-time planning support.";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://karumnieks99.github.io/Travel-Agency").replace(/\/+$/, "");
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const DEFAULT_SOCIAL_IMAGE = "photos/dest-lombok-gili.jpg";
export const DEFAULT_SOCIAL_IMAGE_ALT = "Island scenery from Surga Indonesia Travel";

const MANAGED_SCHEMA_SELECTOR = 'script[data-managed-seo-schema="true"]';

function ensureHeadTag(tagName, attributeName, key) {
  const selector = `${tagName}[${attributeName}="${key}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement(tagName);
    element.setAttribute(attributeName, key);
    document.head.appendChild(element);
  }

  return element;
}

function upsertMeta(attributeName, key, content) {
  if (!content) return;
  const element = ensureHeadTag("meta", attributeName, key);
  element.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  const element = ensureHeadTag("link", "rel", rel);
  element.setAttribute("href", href);
}

function normalizeSchema(schema) {
  if (!schema) return [];
  return Array.isArray(schema) ? schema.filter(Boolean) : [schema];
}

export function buildAbsoluteUrl(path = "") {
  if (!path) return `${SITE_URL}/`;
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path.replace(/^\//, ""), `${SITE_URL}/`).toString();
}

export function buildPageTitle(title) {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
}

export function createTravelAgencySchema() {
  return {
    "@type": "TravelAgency",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: buildAbsoluteUrl(""),
    description: SITE_DESCRIPTION,
    image: buildAbsoluteUrl("photos/logo.png"),
    logo: buildAbsoluteUrl("photos/logo.png"),
    telephone: "+62 811-3806-2116",
    email: "hello@surgaindonesia.travel",
    priceRange: "$$-$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Raya Ubud No. 7",
      addressLocality: "Gianyar",
      addressRegion: "Bali",
      postalCode: "80571",
      addressCountry: "ID",
    },
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+62 811-3806-2116",
        email: "hello@surgaindonesia.travel",
        areaServed: "ID",
        availableLanguage: ["en"],
      },
    ],
  };
}

export function createWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: buildAbsoluteUrl(""),
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    inLanguage: "en",
  };
}

export function createWebPageSchema({ url, title, description, image, pageType = "WebPage", dateModified }) {
  const page = {
    "@type": pageType,
    "@id": `${url}#webpage`,
    url,
    name: buildPageTitle(title),
    description,
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    about: {
      "@id": ORGANIZATION_ID,
    },
    inLanguage: "en",
  };

  if (image) {
    page.primaryImageOfPage = {
      "@type": "ImageObject",
      url: buildAbsoluteUrl(image),
    };
  }

  if (dateModified) {
    page.dateModified = dateModified;
  }

  return page;
}

export function createBreadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.filter(Boolean).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url || buildAbsoluteUrl(item.path || ""),
    })),
  };
}

export function usePageSeo({
  title,
  description,
  path = "",
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = DEFAULT_SOCIAL_IMAGE_ALT,
  type = "website",
  robots = "index,follow",
  schema = [],
}) {
  const schemaNodes = normalizeSchema(schema);
  const schemaValue = JSON.stringify(schemaNodes);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const canonicalUrl = buildAbsoluteUrl(path);
    const socialImage = buildAbsoluteUrl(image);
    const fullTitle = buildPageTitle(title);

    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertLink("canonical", canonicalUrl);

    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", socialImage);
    upsertMeta("property", "og:image:alt", imageAlt);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", socialImage);

    document.head.querySelectorAll(MANAGED_SCHEMA_SELECTOR).forEach((node) => node.remove());

    if (schemaNodes.length) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-managed-seo-schema", "true");
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": schemaNodes,
      });
      document.head.appendChild(script);
    }
  }, [description, image, imageAlt, path, robots, schemaValue, title, type]);
}
