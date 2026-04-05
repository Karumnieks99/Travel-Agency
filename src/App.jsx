import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  CONTACT_PATH,
  HOME_ALIAS_PATH,
  HOME_PATH,
  LEGAL_PATHS,
  TRIP_PATH,
  TRIPS_PATH,
} from "./utils/urls";

const HomePage = lazy(() => import("./pages/HomePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const TripPage = lazy(() => import("./pages/TripPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <Routes>
        <Route path={HOME_PATH} element={<HomePage />} />
        <Route path={HOME_ALIAS_PATH} element={<Navigate to={HOME_PATH} replace />} />
        <Route path={TRIPS_PATH} element={<ServicesPage />} />
        <Route path={CONTACT_PATH} element={<ContactPage />} />
        <Route path={TRIP_PATH} element={<TripPage />} />
        <Route path={LEGAL_PATHS.terms} element={<LegalPage pageKey="terms" />} />
        <Route path={LEGAL_PATHS.cancellation} element={<LegalPage pageKey="cancellation" />} />
        <Route path={LEGAL_PATHS.privacy} element={<LegalPage pageKey="privacy" />} />
        <Route path={LEGAL_PATHS.payments} element={<LegalPage pageKey="payments" />} />
        <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
      </Routes>
    </Suspense>
  );
}
