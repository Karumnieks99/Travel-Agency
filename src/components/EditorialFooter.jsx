import React from "react";
import AppLink from "./AppLink";
import { CONTACT_PATH, LEGAL_PATHS, TRIPS_PATH, buildContactHref } from "../utils/urls";

export default function EditorialFooter({ conciergeTopic = "Concierge request" }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#131b2e] px-6 py-12 xl:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="text-center lg:text-left">
          <span className="font-editorial-serif text-2xl font-bold tracking-tight text-[#8d4b00]">Surga Indonesia Travel</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-center">
          <AppLink href={TRIPS_PATH} className="text-xs uppercase tracking-[0.18em] text-white/60 transition hover:text-[#8d4b00]">
            Destinations
          </AppLink>
          <AppLink
            href={buildContactHref({ source: "editorial-footer", topic: conciergeTopic })}
            className="text-xs uppercase tracking-[0.18em] text-white/60 transition hover:text-[#8d4b00]"
          >
            Concierge
          </AppLink>
          <AppLink href={CONTACT_PATH} className="text-xs uppercase tracking-[0.18em] text-white/60 transition hover:text-[#8d4b00]">
            Contact
          </AppLink>
          <AppLink href={LEGAL_PATHS.privacy} className="text-xs uppercase tracking-[0.18em] text-white/60 transition hover:text-[#8d4b00]">
            Privacy
          </AppLink>
          <AppLink href={LEGAL_PATHS.terms} className="text-xs uppercase tracking-[0.18em] text-white/60 transition hover:text-[#8d4b00]">
            Terms
          </AppLink>
        </div>

        <div className="text-center text-xs uppercase tracking-[0.18em] text-white/40 lg:text-right">
          (c) {year} Surga Indonesia Travel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
