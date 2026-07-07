import React from "react";
import AppLink from "./AppLink";
import { CREDENTIALS, FOUNDED_YEAR } from "../data/trust";
import {
  ABOUT_PATH,
  CONTACT_PATH,
  HOME_PATH,
  LEGAL_PATHS,
  TRIPS_PATH,
  buildContactHref,
  buildWhatsAppHref,
} from "../utils/urls";

// The single site-wide footer. Every page renders this one so the brand reads consistently.
export default function EditorialFooter({ conciergeTopic = "Concierge request" }) {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Explore",
      links: [
        { label: "Home", href: HOME_PATH },
        { label: "Destinations", href: TRIPS_PATH },
        { label: "Our approach", href: ABOUT_PATH },
      ],
    },
    {
      title: "Planning",
      links: [
        { label: "Start planning", href: buildContactHref({ source: "footer", topic: conciergeTopic }) },
        { label: "WhatsApp desk", href: buildWhatsAppHref("Hello, I would like help planning an Indonesia trip.") },
        { label: "Contact", href: CONTACT_PATH },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Privacy", href: LEGAL_PATHS.privacy },
        { label: "Terms", href: LEGAL_PATHS.terms },
        { label: "Cancellation", href: LEGAL_PATHS.cancellation },
        { label: "Payments", href: LEGAL_PATHS.payments },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#131b2e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <p className="font-editorial-serif text-3xl font-bold tracking-tight text-[#ffdcc3]">Surga Indonesia Travel</p>
            <p className="mt-5 text-sm leading-7 text-white/65">
              Private Indonesia routes with practical planning underneath them. Less brochure language, more route logic that
              actually survives the trip.
            </p>
            <div className="mt-6 flex gap-4 text-white/55">
              <a
                className="transition hover:text-[#ffdcc3]"
                href={buildWhatsAppHref("Hello, I would like to plan an Indonesia trip.")}
                aria-label="WhatsApp"
              >
                <span className="material-symbols-outlined">public</span>
              </a>
              <AppLink className="transition hover:text-[#ffdcc3]" href={TRIPS_PATH} aria-label="Destinations">
                <span className="material-symbols-outlined">explore</span>
              </AppLink>
              <a className="transition hover:text-[#ffdcc3]" href="mailto:hello@surgaindonesia.travel" aria-label="Email">
                <span className="material-symbols-outlined">mail</span>
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-editorial-label text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-4 text-sm text-white/65">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <AppLink className="transition hover:text-[#ffdcc3]" href={link.href}>
                      {link.label}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ul className="grid gap-x-8 gap-y-5 border-b border-white/10 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {CREDENTIALS.map((item) => (
            <li key={item.label}>
              <p className="font-editorial-label text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffdcc3]">
                {item.label}
              </p>
              <p className="mt-1.5 text-xs leading-6 text-white/55">{item.detail}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {year} Surga Indonesia Travel. All rights reserved.</span>
          <span>Private archipelago routes &middot; Est. {FOUNDED_YEAR} &middot; Ubud, Bali</span>
        </div>
      </div>
    </footer>
  );
}
