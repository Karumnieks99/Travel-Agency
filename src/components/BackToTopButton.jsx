import React, { useEffect, useState } from "react";

const VISIBILITY_OFFSET = 520;

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let frameId = 0;

    const updateVisibility = () => {
      frameId = 0;
      setIsVisible(window.scrollY > VISIBILITY_OFFSET);
    };

    const handleScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      tabIndex={isVisible ? 0 : -1}
      aria-label="Back to top"
      className={`fixed bottom-24 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-900 bg-white text-2xl leading-none text-slate-900 shadow-lg transition duration-300 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:bottom-6 sm:right-6 ${
        isVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{ marginBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <span aria-hidden>↑</span>
    </button>
  );
}
