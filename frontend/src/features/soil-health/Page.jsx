import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import NewAnalysis from "./pages/NewAnalysis";
import AnalysisResult from "./pages/AnalysisResult";
import History from "./pages/History";
import DeviceStatus from "./pages/DeviceStatus";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import "./SoilHealth.css";
import "./SoilHealthTheme.css";

export default function Page() {
  return (
    <div className="soil-health-module">
      <Sidebar />

      <div className="app-content">
        <Navbar />

        <main id="content" className="main-content">
          <Routes>
            <Route index element={<Dashboard />} />

            <Route
              path="analysis"
              element={<NewAnalysis />}
            />

            <Route
              path="result/:id"
              element={<AnalysisResult />}
            />

            <Route
              path="history"
              element={<History />}
            />

            <Route
              path="device"
              element={<DeviceStatus />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
