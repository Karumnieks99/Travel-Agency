import React from "react";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const page = (document.body.dataset.page || "home").toLowerCase();
  const Page = {
    home: HomePage,
    platform: ServicesPage,
    services: ServicesPage,
    trips: ServicesPage,
    support: ContactPage,
    contacts: ContactPage,
  }[page] || HomePage;

  return <Page />;
}
