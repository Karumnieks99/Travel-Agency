import React, { useMemo } from "react";
import AppLink from "../components/AppLink";
import Layout from "../components/Layout";
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
    <Layout currentPage="">
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Legal</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{legalDoc.title}</h1>
          <p className="mt-3 max-w-3xl text-slate-600">{legalDoc.description}</p>
          <p className="mt-4 text-sm text-slate-500">Last updated: {legalDoc.lastUpdated}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {LEGAL_NAV.map((item) => {
              const active = item.href === `/${legalDoc.page}.html`;
              return (
                <AppLink
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                    active ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </AppLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
          {legalDoc.sections.map((section) => (
            <article key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
              <div className="mt-3 space-y-2">
                {section.body.map((line) => (
                  <p key={line} className="text-sm text-slate-700">
                    {line}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-6 px-4 sm:px-6">
          <h2 className="text-xl font-semibold text-slate-900">Questions about policy terms?</h2>
          <p className="mt-2 text-sm text-slate-700">
            Contact our planning desk for clarification before confirming any itinerary.
          </p>
          <AppLink
            href={buildContactHref()}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Contact planner
          </AppLink>
        </div>
      </section>
    </Layout>
  );
}
