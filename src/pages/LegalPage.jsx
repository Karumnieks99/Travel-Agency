import React, { useMemo } from "react";
import AppLink from "../components/AppLink";
import EditorialFooter from "../components/EditorialFooter";
import Layout from "../components/Layout";
import OptimizedImage from "../components/OptimizedImage";
import SiteHeader from "../components/SiteHeader";
import { LEGAL_NAV, LEGAL_PAGES } from "../data/legal";
import {
  buildAbsoluteUrl,
  createBreadcrumbSchema,
  createTravelAgencySchema,
  createWebPageSchema,
  usePageSeo,
} from "../utils/seo";
import { buildContactHref } from "../utils/urls";

export default function LegalPage({ pageKey }) {
  const legalDoc = LEGAL_PAGES[pageKey] || LEGAL_PAGES.terms;

  const seoSchema = useMemo(() => {
    const homeUrl = buildAbsoluteUrl("");
    const pageUrl = buildAbsoluteUrl(`${legalDoc.page}.html`);
    const parsedUpdatedDate = new Date(legalDoc.lastUpdated);
    const dateModified = Number.isNaN(parsedUpdatedDate.getTime()) ? undefined : parsedUpdatedDate.toISOString().slice(0, 10);

    return [
      createTravelAgencySchema(),
      createWebPageSchema({
        url: pageUrl,
        title: legalDoc.title,
        description: legalDoc.description,
        image: "photos/gallery-rice-terrace.jpg",
        dateModified,
      }),
      createBreadcrumbSchema([
        { name: "Home", url: homeUrl },
        { name: legalDoc.shortTitle || legalDoc.title, url: pageUrl },
      ]),
    ];
  }, [legalDoc]);

  usePageSeo({
    title: legalDoc.title,
    description: legalDoc.description,
    path: `${legalDoc.page}.html`,
    image: "photos/gallery-rice-terrace.jpg",
    imageAlt: `${legalDoc.title} for Surga Indonesia Travel`,
    schema: seoSchema,
  });

  return (
    <Layout currentPage="" renderHeader={false} renderFooter={false}>
      <div className="bg-[#faf8ff] text-[#131b2e]">
        <SiteHeader
          currentPage=""
          variant="editorial"
          ctaHref={buildContactHref({ source: "legal-header", topic: `Question: ${legalDoc.title}` })}
          ctaLabel="Start planning"
          showCta={false}
          brandSubtitle={null}
        />

        <section className="relative isolate overflow-hidden bg-[#0d0d0b] text-white">
          <OptimizedImage
            src="photos/gallery-rice-terrace.jpg"
            alt={`${legalDoc.title} background`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="1600"
            height="1066"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/50 to-black/80" aria-hidden />

          <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
            <nav className="font-editorial-label flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/70">
              <AppLink className="transition hover:text-white" href="/">
                Home
              </AppLink>
              <span aria-hidden>/</span>
              <span className="text-white">{legalDoc.shortTitle || legalDoc.title}</span>
            </nav>
            <div className="mt-6 max-w-4xl">
              <p className="font-editorial-label text-xs uppercase tracking-[0.34em] text-white/80">Legal documents</p>
              <h1 className="font-editorial-display mt-6 text-5xl font-bold uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl lg:text-[5.2rem]">
                {legalDoc.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/88 sm:text-xl sm:leading-9">{legalDoc.description}</p>
              <p className="font-editorial-label mt-6 text-[10px] uppercase tracking-[0.24em] text-white/70">
                Last updated {legalDoc.lastUpdated}
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white py-10">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 sm:px-6 lg:px-8">
            {LEGAL_NAV.map((item) => {
              const active = item.href === `/${legalDoc.page}.html`;
              return (
                <AppLink
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    active ? "bg-black text-white" : "border border-black/10 bg-[#faf8ff] text-slate-700 hover:bg-black hover:text-white"
                  }`}
                >
                  {item.label}
                </AppLink>
              );
            })}
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6">
              {legalDoc.sections.map((section, index) => (
                <article key={section.heading} className="border border-black/10 bg-white p-6 md:p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-3xl">
                      <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-[#8d4b00]">
                        Section {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="font-editorial-serif mt-3 text-2xl font-bold text-[#131b2e] md:text-3xl">{section.heading}</h2>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {section.body.map((line) => (
                      <p key={line} className="max-w-4xl text-sm leading-7 text-slate-700 md:text-base">
                        {line}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-black/10 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-t-2 border-black bg-[#faf8ff] p-8 md:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <p className="font-editorial-label text-[10px] uppercase tracking-[0.24em] text-[#8d4b00]">Need clarification?</p>
                  <h2 className="font-editorial-display mt-4 text-3xl font-bold text-[#131b2e] md:text-4xl">Ask before you confirm the itinerary</h2>
                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    If any policy detail affects your booking decision, ask the planning desk before paying a deposit. We will explain how it applies to your specific route.
                  </p>
                </div>
                <AppLink
                  href={buildContactHref({ source: "legal-cta", topic: `Question: ${legalDoc.title}` })}
                  className="inline-flex items-center justify-center bg-black px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Contact planning desk
                </AppLink>
              </div>
            </div>
          </div>
        </section>

        <EditorialFooter conciergeTopic={`Concierge: ${legalDoc.title}`} />
      </div>
    </Layout>
  );
}
