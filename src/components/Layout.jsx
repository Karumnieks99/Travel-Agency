import React, { useMemo } from "react";
import SiteHeader from "./SiteHeader";
import { buildContactHref } from "../utils/urls";

export default function Layout({ currentPage, children, renderHeader = true, headerVariant = "solid" }) {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-amber-100 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-amber-800"
      >
        Skip to content
      </a>

      {renderHeader && <SiteHeader currentPage={currentPage} variant={headerVariant} />}

      <main id="main" className="pb-16">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center lg:flex-row lg:items-center lg:gap-6 lg:text-left">
          <div className="flex items-center gap-3">
            <img src="photos/logo.png" alt="Surga Indonesia Travel" className="h-9 w-9 rounded-lg object-cover" />
            <p className="whitespace-normal text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 leading-tight lg:whitespace-nowrap">
              Surga Indonesia Travel - Discover the Spirit of Indonesia
            </p>
          </div>
          <p className="text-sm text-slate-500">(c) {year} Surga Indonesia Travel. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-slate-700 lg:flex-nowrap lg:gap-4">
            <a className="hover:text-amber-700" href="index.html">
              Home
            </a>
            <a className="hover:text-amber-700" href="platform.html">
              Trips
            </a>
            <a className="hover:text-amber-700" href={buildContactHref()}>
              Contacts
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
