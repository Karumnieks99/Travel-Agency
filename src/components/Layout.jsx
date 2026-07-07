import React, { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import BackToTopButton from "./BackToTopButton";
import EditorialFooter from "./EditorialFooter";
import SiteHeader from "./SiteHeader";
import MobileWhatsAppButton from "./MobileWhatsAppButton";

const scrollPositions = new Map();

export default function Layout({
  currentPage,
  children,
  renderHeader = true,
  headerVariant = "solid",
  renderFooter = true,
}) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const mainRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.history?.scrollRestoration) return undefined;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const scrollKey = location.key || `${location.pathname}${location.search}`;

    const focusHashTarget = () => {
      const targetId = decodeURIComponent(location.hash.slice(1));
      if (!targetId) return false;

      const target = document.getElementById(targetId);
      if (!target) return false;

      const hadTabIndex = target.hasAttribute("tabindex");
      const previousTabIndex = target.getAttribute("tabindex");

      if (!hadTabIndex) {
        target.setAttribute("tabindex", "-1");
      }

      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start" });

      return () => {
        if (!hadTabIndex) {
          target.removeAttribute("tabindex");
          return;
        }

        if (previousTabIndex !== null) {
          target.setAttribute("tabindex", previousTabIndex);
        }
      };
    };

    let restoreTargetFocus;
    const frameId = window.requestAnimationFrame(() => {
      const restoreHashTarget = location.hash ? focusHashTarget() : false;

      if (restoreHashTarget) {
        restoreTargetFocus = restoreHashTarget;
        return;
      }

      if (navigationType === "POP") {
        const savedScrollTop = scrollPositions.get(scrollKey);

        if (typeof savedScrollTop === "number") {
          window.scrollTo({ top: savedScrollTop, left: 0, behavior: "auto" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      mainRef.current?.focus({ preventScroll: true });
    });

    return () => {
      scrollPositions.set(scrollKey, window.scrollY);
      window.cancelAnimationFrame(frameId);
      restoreTargetFocus?.();
    };
  }, [location.hash, location.key, location.pathname, location.search, navigationType]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-amber-100 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-amber-800"
      >
        Skip to content
      </a>

      {renderHeader && <SiteHeader currentPage={currentPage} variant={headerVariant} />}

      <main id="main" ref={mainRef} tabIndex={-1} className="focus:outline-none">
        {children}
      </main>

      {renderFooter ? <EditorialFooter /> : null}

      <MobileWhatsAppButton />
      <BackToTopButton />
    </div>
  );
}
