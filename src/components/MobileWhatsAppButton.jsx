import React from "react";
import { MOBILE_WHATSAPP_LABEL } from "../data/trust";
import { buildWhatsAppHref } from "../utils/urls";

export default function MobileWhatsAppButton() {
  return (
    <a
      href={buildWhatsAppHref("Hi Surga team, I would like help planning my Indonesia trip.")}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold text-emerald-50 shadow-lg ring-1 ring-emerald-500 transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:hidden"
      style={{ marginBottom: "max(0px, env(safe-area-inset-bottom))" }}
      aria-label="Chat with planner on WhatsApp"
    >
      <span aria-hidden>WA</span>
      <span>{MOBILE_WHATSAPP_LABEL}</span>
    </a>
  );
}
