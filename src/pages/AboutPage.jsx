import React, { useMemo } from "react";
import AppLink from "../components/AppLink";
import EditorialFooter from "../components/EditorialFooter";
import FaqAccordion from "../components/FaqAccordion";
import Layout from "../components/Layout";
import OptimizedImage from "../components/OptimizedImage";
import SiteHeader from "../components/SiteHeader";
import SpecialistGrid from "../components/SpecialistGrid";
import Testimonials from "../components/Testimonials";
import TrustStats from "../components/TrustStats";
import { FOUNDED_YEAR, OPERATING_PRINCIPLES, PLANNING_STEPS } from "../data/trust";
import {
  buildAbsoluteUrl,
  createBreadcrumbSchema,
  createTravelAgencySchema,
  createWebPageSchema,
  usePageSeo,
} from "../utils/seo";
import { TRIPS_PATH, buildContactHref, buildWhatsAppHref } from "../utils/urls";

const ABOUT_TITLE = "Our Approach & the Planning Desk";
const ABOUT_DESCRIPTION =
  "Meet the planners behind Surga Indonesia Travel: how we build private Indonesia routes around real logistics, and the local specialists who run them.";
const YEARS_RUNNING = new Date().getFullYear() - FOUNDED_YEAR;

export default function AboutPage() {
  const seoSchema = useMemo(() => {
    const homeUrl = buildAbsoluteUrl("");
    const pageUrl = buildAbsoluteUrl("about.html");
    return [
      createTravelAgencySchema(),
      createWebPageSchema({
        url: pageUrl,
        title: ABOUT_TITLE,
        description: ABOUT_DESCRIPTION,
        image: "photos/dest-besakih-bali.jpg",
        pageType: "AboutPage",
      }),
      createBreadcrumbSchema([
        { name: "Home", url: homeUrl },
        { name: "About", url: pageUrl },
      ]),
    ];
  }, []);

  usePageSeo({
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    path: "about.html",
    image: "photos/dest-besakih-bali.jpg",
    imageAlt: "Pura Besakih temple terraces on Bali",
    schema: seoSchema,
  });

  return (
    <Layout currentPage="about" renderHeader={false} renderFooter={false}>
      <div className="bg-[#f8f5ee] text-[#131b2e]">
        <SiteHeader
          currentPage="about"
          variant="editorial"
          ctaHref={buildContactHref({ source: "about-header", topic: "Start planning" })}
          ctaLabel="Start planning"
          showCta={false}
          brandSubtitle={null}
        />

        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-[#0d0d0b] text-white">
          <OptimizedImage
            src="photos/dest-besakih-bali.jpg"
            alt="Temple terraces beneath a volcano on Bali"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width="1600"
            height="1066"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/45 to-black/85" aria-hidden />

          <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:px-8 lg:pb-24 lg:pt-44">
            <nav className="font-editorial-label flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/70">
              <AppLink className="transition hover:text-white" href="/">
                Home
              </AppLink>
              <span aria-hidden>/</span>
              <span className="text-white">About</span>
            </nav>
            <div className="mt-6 max-w-4xl">
              <p className="font-editorial-label text-xs uppercase tracking-[0.34em] text-white/80">Our approach</p>
              <h1 className="font-editorial-display mt-6 text-5xl font-bold uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-7xl lg:text-[5.2rem]">
                We plan Indonesia the way it
                <br />
                <span className="font-editorial-serif italic normal-case tracking-tight text-[#ffdcc3]">actually moves</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl sm:leading-9">
                A small team of local planners in Ubud, building private routes across the archipelago since {FOUNDED_YEAR}.
                We sell the logistics that make a trip feel effortless, not the postcard.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
            <div className="max-w-2xl">
              <h2 className="font-editorial-display text-4xl font-bold leading-tight text-[#131b2e] sm:text-5xl">
                Started by guides who were tired of trips that looked good only on paper
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
                <p>
                  Surga began in {FOUNDED_YEAR}, after years of guiding travelers whose itineraries had been sold from a
                  brochure a continent away. The photos were beautiful. The ferry connections were impossible, the drive
                  times were guesses, and the &ldquo;sunrise&rdquo; started three hours too late.
                </p>
                <p>
                  So we rebuilt the process backwards, from the ground up. Every route starts with what the islands can
                  actually deliver on a given week &mdash; boat windows, transfer buffers, arrival days &mdash; and the
                  highlights get arranged around that reality. {YEARS_RUNNING} years and hundreds of trips later, it is
                  still the whole idea.
                </p>
              </div>
              <blockquote className="mt-8 border-t-2 border-[#8d4b00] pt-6 font-editorial-serif text-2xl italic leading-9 text-[#131b2e]">
                &ldquo;The route is the product. Get the logistics right and the postcard takes care of itself.&rdquo;
              </blockquote>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden border border-black/10">
              <OptimizedImage
                src="photos/gallery-flores-ridge.jpg"
                alt="A planner's-eye view of a Flores ridgeline at first light"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                width="1000"
                height="1250"
              />
            </div>
          </div>
        </section>

        {/* How we plan */}
        <section className="border-y border-black/10 bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl border-b-2 border-black pb-8">
              <h2 className="font-editorial-display text-4xl font-bold text-[#131b2e] sm:text-5xl">
                Four steps, no black box
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                You always know what stage the plan is in and what happens next. Nothing is charged, and nothing is locked,
                until you have seen a route you approve of.
              </p>
            </div>
            <ol className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {PLANNING_STEPS.map((item) => (
                <li key={item.step} className="border border-black/10 bg-[#f8f5ee] p-6">
                  <p className="font-editorial-display text-4xl font-bold text-[#8d4b00]">{item.step}</p>
                  <h3 className="font-editorial-serif mt-4 text-xl font-bold leading-tight text-[#131b2e]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* The numbers */}
        <section className="bg-[#101826] py-20 text-white lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl border-t-2 border-[#ffdcc3] pt-8">
              <h2 className="font-editorial-display text-3xl font-bold text-white sm:text-4xl">The record so far</h2>
              <p className="mt-4 text-lg leading-8 text-white/70">
                Numbers we can stand behind, kept honest by the fact that the same planners answer the phone when something
                needs fixing.
              </p>
            </div>
            <TrustStats tone="dark" className="mt-10" />
          </div>
        </section>

        {/* Principles */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="font-editorial-display text-4xl font-bold text-[#131b2e] sm:text-5xl">
                The principles the whole desk works from
              </h2>
            </div>
            <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
              {OPERATING_PRINCIPLES.map((item) => (
                <div key={item.title} className="border-t border-black/15 pt-6">
                  <h3 className="font-editorial-serif text-2xl font-bold text-[#131b2e]">{item.title}</h3>
                  <p className="mt-4 text-base leading-8 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the desk */}
        <section className="border-y border-black/10 bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="font-editorial-display text-4xl font-bold text-[#131b2e] sm:text-5xl">
                The people who actually build your route
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                No call center, no handoff to a supplier you never meet. You are matched to the planner who knows your
                region best, and they stay with you through the trip.
              </p>
            </div>
            <SpecialistGrid className="mt-12" />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-editorial-label text-[10px] uppercase tracking-[0.3em] text-[#8d4b00]">In their words</p>
              <h2 className="font-editorial-display mt-4 text-4xl font-bold text-[#131b2e] sm:text-5xl">
                What travelers tell us afterward
              </h2>
            </div>
            <Testimonials className="mt-10" count={3} startIndex={0} />
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-black/10 bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="font-editorial-label text-[10px] uppercase tracking-[0.3em] text-[#8d4b00]">Before you ask</p>
              <h2 className="font-editorial-display mt-4 text-4xl font-bold text-[#131b2e] sm:text-5xl">
                Questions we hear most
              </h2>
            </div>
            <FaqAccordion className="mt-10" />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#f5efe4] py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-t-2 border-black bg-[#131b2e] p-10 text-white md:p-14">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="font-editorial-display text-4xl font-bold sm:text-5xl">
                    Tell us the rough shape of your trip
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-white/75">
                    Month, group size, and the islands you care about most are enough to start. We come back with route
                    logic, live availability, and next steps.
                  </p>
                </div>
                <div className="flex w-full max-w-sm flex-col gap-3">
                  <AppLink
                    href={buildContactHref({ source: "about-cta", topic: "Route planning conversation" })}
                    className="inline-flex w-full items-center justify-center bg-[#8d4b00] px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#b15f00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3]"
                  >
                    Start planning
                  </AppLink>
                  <a
                    href={buildWhatsAppHref("Hello, I would like help planning an Indonesia trip.")}
                    className="inline-flex w-full items-center justify-center border border-white/25 px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdcc3]"
                  >
                    Ask on WhatsApp
                  </a>
                  <AppLink
                    href={TRIPS_PATH}
                    className="mt-1 text-center font-editorial-label text-[11px] uppercase tracking-[0.22em] text-white/60 transition hover:text-[#ffdcc3]"
                  >
                    Or browse the destinations
                  </AppLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EditorialFooter conciergeTopic="Concierge: About" />
      </div>
    </Layout>
  );
}
