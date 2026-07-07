import { ABOUT_PATH, CONTACT_PATH, HOME_PATH, TRIPS_PATH } from "../utils/urls";

export const NAV_LINKS = [
  { label: "Home", href: HOME_PATH, pageKey: "home" },
  { label: "Destinations", href: TRIPS_PATH, pageKey: "trips" },
  { label: "About", href: ABOUT_PATH, pageKey: "about" },
  { label: "Contact", href: CONTACT_PATH, pageKey: "contacts" },
];
