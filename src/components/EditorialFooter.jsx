import React from "react";
import AppLink from "./AppLink";
import { CONTACT_PATH, LEGAL_PATHS, TRIPS_PATH, buildContactHref } from "../utils/urls";

export default function EditorialFooter({ conciergeTopic = "Concierge request" }) {
  const year = new Date().getFullYear();

  const linkClass =
    "inline-flex items-center px-1 py-2 text-xs uppercase tracking-[0.18em] text-white/65 transition hover:text-[#ffdcc3]";

  return (
    <footer className="border-t border-white/10 bg-[#131b2e] px-6 py-12 xl:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="text-center lg:text-left">
          <span className="font-editorial-serif text-2xl font-bold tracking-tight text-[#ffdcc3]">Surga Indonesia Travel</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center">
          <AppLink href={TRIPS_PATH} className={linkClass}>
            Destinations
          </AppLink>
          <AppLink href={buildContactHref({ source: "editorial-footer", topic: conciergeTopic })} className={linkClass}>
            Concierge
          </AppLink>
          <AppLink href={CONTACT_PATH} className={linkClass}>
            Contact
          </AppLink>
          <AppLink href={LEGAL_PATHS.privacy} className={linkClass}>
            Privacy
          </AppLink>
          <AppLink href={LEGAL_PATHS.terms} className={linkClass}>
            Terms
          </AppLink>
        </div>

        <div className="text-center text-xs uppercase tracking-[0.18em] text-white/55 lg:text-right">
          (c) {year} Surga Indonesia Travel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
