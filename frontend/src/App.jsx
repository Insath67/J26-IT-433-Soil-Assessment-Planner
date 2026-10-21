
import { useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import Navigation from "./shared/Navigation";
import Footer from "./shared/Footer";
import HomePage from "./pages/HomePage";
import SoilScan from "./features/soil-scan/Page";
import SoilHealth from "./features/soil-health/Page";
import CropFinder from "./features/crop-finder/App";
import FertilizerGuide from "./features/fertilizer-guide/Page";

import "./shared/workspace.css";
import "./shared/theme.css";

const PAGE_KEYS = {
  "/": "nav.home",
  "/soil-scan": "nav.soil-scan",
  "/soil-health": "nav.soil-health",
  "/crop-finder": "nav.crop-finder",
  "/fertilizer-guide": "nav.fertilizer-guide",
};

const TEXT = {
  en: {
    skip: "Skip to content",
    notFound: "Page not found",
    returnHome: "Return to home",
  },
  si: {
    skip: "ප්‍රධාන අන්තර්ගතයට යන්න",
    notFound: "පිටුව හමු නොවීය",
    returnHome: "මුල් පිටුවට යන්න",
  },
  ta: {
    skip: "முக்கிய உள்ளடக்கத்திற்குச் செல்லவும்",
    notFound: "பக்கம் கிடைக்கவில்லை",
    returnHome: "முகப்பிற்குத் திரும்பவும்",
  },
};

export default function App() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  const language = i18n.resolvedLanguage || "en";
  const text = TEXT[language] || TEXT.en;

  // Recognize all Soil Health subpages
  const isSoilHealthPage =
    pathname === "/soil-health" ||
    pathname.startsWith("/soil-health/");

  const pageKey = isSoilHealthPage
    ? PAGE_KEYS["/soil-health"]
    : PAGE_KEYS[pathname];

  const pageTitle = pageKey
    ? t(pageKey)
    : text.notFound;

  // Scroll to top when changing pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Update browser tab title
  useEffect(() => {
    document.title = `${pageTitle} | Saru Bima`;
  }, [pageTitle]);

  return (
    <>
      <a
        className="skip-link"
        href={
          pathname === "/crop-finder"
            ? "#main"
            : "#content"
        }
      >
        {text.skip}
      </a>

      <Navigation />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/soil-scan"
          element={<SoilScan />}
        />

        {/* Soil Health and all subpages */}
        <Route
          path="/soil-health/*"
          element={<SoilHealth />}
        />

        <Route
          path="/crop-finder"
          element={
            <div className="crop-module">
              <CropFinder />
            </div>
          }
        />

        <Route
          path="/fertilizer-guide"
          element={<FertilizerGuide />}
        />

        <Route
          path="*"
          element={
            <main
              id="content"
              className="module-page"
            >
              <h1>{text.notFound}</h1>

              <Link to="/">
                {text.returnHome}
              </Link>
            </main>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}
