import { useMemo } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Layers,
  Sprout,
  MapPin,
  FileDown,
  Printer,
  LayoutDashboard,
  History as HistoryIcon,
} from "lucide-react";
import { getSampleById, setActiveSample } from "../services/soilStorage";
import { downloadSoilReportPdf, printSoilReport } from "../services/pdfGenerator";

function AnalysisResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sample = useMemo(() => getSampleById(id || "KG-001"), [id]);
  const location = useLocation();
  const prediction = location.state?.soilTypePrediction ?? null;

  const handleDownloadPdf = () => {
    downloadSoilReportPdf(sample);
  };

  const handleSetDashboardActive = () => {
    setActiveSample(sample.sampleId);
    navigate("/soil-health");
  };

  const score = sample.fertilityScore || 74;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Percentage calculations for bars
  const nPercent = Math.min(100, Math.round(((sample.nitrogen || 42) / 50) * 100));
  const pPercent = Math.min(100, Math.round(((sample.phosphorus || 28) / 55) * 100));
  const kPercent = Math.min(100, Math.round(((sample.potassium || 55) / 70) * 100));

  const pIsDeficient = (sample.phosphorus || 28) < 35;
  return (
    <div className="subpage-container">
      {/* Navigation breadcrumb */}
      <div style={{ marginBottom: "18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/soil-health" className="view-more-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <ArrowLeft size={16} />
          <span>Back to Soil Dashboard</span>
        </Link>
        <Link to="/soil-health/history" className="view-more-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <HistoryIcon size={15} />
          <span>View All Saved Samples</span>
        </Link>
      </div>

      <div className="page-header">
        <div>
          <div className="header-badge-row">
            <span className="live-status-pill">
              <span className="status-dot"></span>
              ML Inference Report
            </span>
            <span className="agro-zone-tag">Sample: {sample.sampleId}</span>
          </div>
          <h1 className="page-title">Soil Analysis Report</h1>
          <p className="page-subtitle">
            Multivariate assessment for sample #{sample.sampleId} based on image texture and electrochemical readings.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button 
            className="secondary-btn" 
            onClick={printSoilReport}
            title="Open printable document preview"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>

          <button 
            className="primary-btn" 
            onClick={handleDownloadPdf}
            title="Download direct PDF file to your computer"
          >
            <FileDown size={16} />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Verified Specimen Card */}
      <div className="sample-card-glass" style={{ marginBottom: "24px" }}>
        <div className="sample-grid">
          <div className="sample-meta-cell">
            <span className="meta-label">Sample ID</span>
            <span className="sample-badge-id">{sample.sampleId}</span>
            <span className="meta-sub">Recorded: {sample.date || "15/10/2026"}</span>
          </div>
          <div className="sample-meta-cell">
            <span className="meta-label">Origin & Zone</span>
            <div className="meta-value-row">
              <MapPin size={16} className="text-dark-green" />
              <strong className="meta-value">{sample.location || "Kegalle"}</strong>
            </div>
            <span className="meta-sub">{sample.district || "Wet Zone WL2a"}</span>
          </div>
          <div className="sample-meta-cell">
            <span className="meta-label">Texture Class</span>
            <div className="meta-value-row">
              <Layers size={16} className="text-light-green" />
              <strong className="meta-value">{sample.soilType || sample.soilColor || "Red-Yellow Podzolic"}</strong>
            </div>
            <span className="meta-sub">Depth: {sample.samplingDepth || "0 - 15 cm"}</span>
          </div>
          <div className="sample-meta-cell">
            <span className="meta-label">Status</span>
            <div className="meta-value-row">
              <CheckCircle2 size={16} className="text-light-green" />
              <strong className="meta-value">Assessment Complete</strong>
            </div>
            <span className="meta-sub">Confidence: {sample.confidence || "95.4%"}</span>
          </div>
        </div>
      </div>

      {/* NEW: ML Soil Nutrient Prediction Results */}

{prediction && (
  <section
    className="dashboard-section"
    style={{ marginBottom: "28px" }}
  >
    <h2 className="section-title">
      ML Soil Nutrient Estimation
    </h2>

    <p className="section-desc">
      Selected Soil Type: {prediction.soil_type}
    </p>

    <div
      className="form-grid"
      style={{ marginTop: "20px" }}
    >
      {[
        ["Nitrogen (N)", prediction.nitrogen, "mg/kg"],
        ["Phosphorus (P)", prediction.phosphorus, "mg/kg"],
        ["Potassium (K)", prediction.potassium, "mg/kg"],
        ["Soil pH", prediction.ph, ""],
      ].map(([label, value, unit]) => (
        <div className="subpage-card" key={label}>
          <h3>{label}</h3>
          <h2>
            {value} {unit}
          </h2>
          <p>Estimated from dataset</p>
        </div>
      ))}
    </div>

    {prediction.warning && (
      <p
        style={{
          marginTop: "16px",
          fontSize: "13px",
          color: "#b45309",
        }}
      >
        {prediction.warning}
      </p>
    )}
  </section>
)}

      {/* Fertility Hero Card */}
      <div className="fertility-hero-card" style={{ marginBottom: "28px" }}>
        <div className="fertility-main-content">
          {/* Score Gauge */}
          <div className="fertility-score-box">
            <div className="circular-gauge-wrap">
              <svg className="circular-gauge-svg" width="110" height="110" viewBox="0 0 110 110">
                <circle className="gauge-bg" cx="55" cy="55" r={radius} strokeWidth="9" />
                <circle
                  className="gauge-progress"
                  cx="55"
                  cy="55"
                  r={radius}
                  strokeWidth="9"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="gauge-score-inner">
                <span className="gauge-number">{score}</span>
                <span className="gauge-denom">/ 100</span>
              </div>
            </div>
            <span className={`fertility-pill pill-${(sample.fertility || "medium").toLowerCase()}`}>
              <Sprout size={14} />
              {sample.fertility || "Medium"} Fertility
            </span>
          </div>

          {/* Details & Submetrics */}
          <div className="fertility-details">
            <h3 className="fertility-heading">Soil Fertility Classification</h3>
            <p className="fertility-description">
                This sample is classified as {sample.fertility || "Medium"} fertility from its N, P, K and pH measurements.
            </p>
            <div className="fertility-submetrics">
              <div className="submetric-item">
                <div className="submetric-label">
                  <span>Nitrogen ({sample.nitrogen} mg/kg)</span>
                  <strong>{nPercent}%</strong>
                </div>
                <div className="submetric-bar">
                  <div className="submetric-fill" style={{ width: `${nPercent}%` }}></div>
                </div>
              </div>
              <div className="submetric-item">
                <div className="submetric-label">
                  <span>Phosphorus ({sample.phosphorus} mg/kg)</span>
                  <strong>{pPercent}%</strong>
                </div>
                <div className="submetric-bar">
                  <div className={`submetric-fill ${pIsDeficient ? "bar-deficient" : ""}`} style={{ width: `${pPercent}%` }}></div>
                </div>
              </div>
              <div className="submetric-item">
                <div className="submetric-label">
                  <span>Potassium ({sample.potassium} mg/kg)</span>
                  <strong>{kPercent}%</strong>
                </div>
                <div className="submetric-bar">
                  <div className="submetric-fill" style={{ width: `${kPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Action footer */}
      <div className="dashboard-actions-panel">
        <div className="action-panel-text">
          <h3>Set {sample.sampleId} as Active Dashboard Specimen?</h3>
          <p>Load this analysis into the main dashboard to view comprehensive IoT charts and nutrient benchmarks.</p>
        </div>
        <div className="action-buttons-group">
          <button 
            type="button" 
            className="primary-btn"
            onClick={handleSetDashboardActive}
          >
            <LayoutDashboard size={16} />
            <span>View in Main Dashboard</span>
          </button>
          <button 
            type="button" 
            className="secondary-btn"
            onClick={handleDownloadPdf}
          >
            <FileDown size={16} />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResult;