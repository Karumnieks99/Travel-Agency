import { LEGAL_PATHS } from "../utils/urls";

export const LEGAL_PAGES = {
  terms: {
    page: "terms",
    title: "Terms of Service",
    shortTitle: "Terms",
    description:
      "These terms explain how Surga Indonesia Travel proposals, confirmations, and services are provided for private and small-group trips.",
    lastUpdated: "February 20, 2026",
    sections: [
      {
        heading: "1. Trip proposals and confirmations",
        body: [
          "Initial proposals, sample prices, and route drafts are estimates.",
          "A booking is confirmed only after you approve the final itinerary and we receive the required deposit.",
          "Quoted availability depends on suppliers such as hotels, boats, and domestic flights at the time of confirmation.",
        ],
      },
      {
        heading: "2. Payments",
        body: [
          "Deposit and balance schedules are listed on your invoice.",
          "Payments are accepted by bank transfer and approved payment links.",
          "Bank transfer fees, exchange fees, and card fees from third parties are paid by the traveler unless stated otherwise.",
        ],
      },
      {
        heading: "3. Changes by traveler",
        body: [
          "Date and route changes are requested in writing and are subject to supplier availability.",
          "Change fees may apply when hotels, boats, guides, or flights have already been ticketed.",
          "We always try to offer equivalent alternatives before charging additional fees.",
        ],
      },
      {
        heading: "4. Safety and conduct",
        body: [
          "Travelers must follow guide and captain safety instructions for treks, marine activities, and transport.",
          "We may suspend activities when weather, sea, volcanic, or local authority conditions require it.",
          "Illegal or unsafe behavior can lead to service refusal without refund for the affected component.",
        ],
      },
      {
        heading: "5. Liability limits",
        body: [
          "Surga Indonesia Travel coordinates third-party suppliers and local partners.",
          "Our liability is limited to the amount paid for services directly managed by us, except where local law requires otherwise.",
          "We are not responsible for delays, cancellations, or losses caused by force majeure events outside our control.",
        ],
      },
    ],
  },
  cancellation: {
    page: "cancellation",
    title: "Cancellation Policy",
    shortTitle: "Cancellation",
    description:
      "This policy describes refund timing and rebooking options for confirmed trips, including partial supplier penalties.",
    lastUpdated: "February 20, 2026",
    sections: [
      {
        heading: "1. Cancellation by traveler",
        body: [
          "90+ days before trip start: deposit refundable minus non-refundable third-party charges.",
          "60-89 days before trip start: 50% of total trip cost refundable, minus non-refundable third-party charges.",
          "0-59 days before trip start: non-refundable for confirmed services unless suppliers approve exceptions.",
        ],
      },
      {
        heading: "2. Non-refundable items",
        body: [
          "Some domestic flights, marine permits, event tickets, and special-rate stays may be non-refundable once issued.",
          "Your invoice notes these items when they apply.",
        ],
      },
      {
        heading: "3. Rebooking option",
        body: [
          "When possible, paid amounts can be moved to new dates within 12 months.",
          "Rebooking depends on supplier rules and may require price differences for peak periods.",
        ],
      },
      {
        heading: "4. Cancellation by operator",
        body: [
          "If we cancel a component due to safety or force majeure, we provide an equivalent alternative or credit where available.",
          "If no equivalent option exists, we refund the recoverable amount from suppliers plus directly managed service amounts.",
        ],
      },
    ],
  },
  privacy: {
    page: "privacy",
    title: "Privacy Policy",
    shortTitle: "Privacy",
    description:
      "This policy explains what booking information we collect, how we use it, and when it is shared with vetted suppliers.",
    lastUpdated: "February 20, 2026",
    sections: [
      {
        heading: "1. Information we collect",
        body: [
          "Contact details such as name, email, phone, and WhatsApp number.",
          "Trip preferences, travel dates, dietary or mobility notes shared for planning.",
          "Payment and invoice references required for accounting and confirmations.",
        ],
      },
      {
        heading: "2. How information is used",
        body: [
          "To build proposals, confirm bookings, and coordinate on-trip operations.",
          "To provide support during disruptions such as weather or transport changes.",
          "To meet legal and tax obligations where required.",
        ],
      },
      {
        heading: "3. Data sharing",
        body: [
          "We share only necessary details with hotels, transport operators, guides, and insurance or payment partners.",
          "We do not sell personal data for advertising.",
        ],
      },
      {
        heading: "4. Retention and security",
        body: [
          "Booking records are retained as required for legal, accounting, and support operations.",
          "Access is restricted to team members who need the data for service delivery.",
        ],
      },
      {
        heading: "5. Requests",
        body: [
          "You can request access, correction, or deletion of personal data, subject to legal retention obligations.",
          "Submit requests to privacy@surgaindonesia.travel.",
        ],
      },
    ],
  },
  payments: {
    page: "payments",
    title: "Payment Policy",
    shortTitle: "Payment Policy",
    description:
      "This policy covers invoice currency, deposit schedule, accepted methods, and payment verification steps.",
    lastUpdated: "February 20, 2026",
    sections: [
      {
        heading: "1. Invoice and currency",
        body: [
          "Invoices are issued in IDR or USD as confirmed in your final proposal.",
          "Any third-party conversion rates are handled by your bank or card provider.",
        ],
      },
      {
        heading: "2. Deposit and balance schedule",
        body: [
          "Standard deposit is 25% to secure dates and suppliers.",
          "Final balance is due 30 days before trip start unless a custom schedule is approved in writing.",
        ],
      },
      {
        heading: "3. Accepted payment methods",
        body: [
          "Bank transfer to official PT Surga Indonesia Travel accounts.",
          "Verified payment links shared from official team contacts.",
        ],
      },
      {
        heading: "4. Verification and fraud prevention",
        body: [
          "Always verify beneficiary details on the latest invoice before sending funds.",
          "We never request payments to personal accounts.",
        ],
      },
      {
        heading: "5. Late payment handling",
        body: [
          "Unpaid balances may release held inventory and supplier space without guarantee of reinstatement.",
          "If payment is delayed, contact the planner immediately to discuss alternatives.",
        ],
      },
    ],
  },
};

export const LEGAL_NAV = [
  { label: "Terms", href: LEGAL_PATHS.terms },
  { label: "Cancellation", href: LEGAL_PATHS.cancellation },
  { label: "Privacy", href: LEGAL_PATHS.privacy },
  { label: "Payment Policy", href: LEGAL_PATHS.payments },
];
