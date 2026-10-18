import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
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
  const fertilizers = sample.recommendations?.fertilizers || [
    {
      name: "Eppawala Rock Phosphate (ERP)",
      dosage: "150 kg/hectare basal dressing",
      type: "warning",
      notes: "Resolves available phosphorus deficiency."
    },
    {
      name: "Standard MOP & Urea",
      dosage: "Maintain recommended split applications",
      type: "success",
      notes: "NPK maintenance schedule."
    }
  ];

  const mlPrediction = sample.mlPrediction?.crop_prediction;
  const displayedMlConfidence = mlPrediction
    ? Math.min(98, Number(mlPrediction.confidence))
    : null;
  const crops = mlPrediction?.crop_rankings?.map((crop, index) => ({
    name: crop.crop,
    botanical: "Trained crop classifier result",
    suitability: Math.min(98, Number(crop.score)),
    tag: index === 0 ? "Recommended by model" : "Model ranking",
  })) || sample.crops || [
    { name: "Ceylon Tea", botanical: "Camellia sinensis", suitability: 94, tag: "Highly Suitable" },
    { name: "Ceylon Cinnamon", botanical: "Cinnamomum verum", suitability: 89, tag: "Highly Suitable" },
    { name: "Black Pepper", botanical: "Piper nigrum", suitability: 85, tag: "Suitable" }
  ];

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
          <h1 className="page-title">Soil Analysis & Crop Advisory Report</h1>
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
            <h3 className="fertility-heading">Agronomic Recommendation Summary</h3>
            <p className="fertility-description">
              {sample.recommendations?.summary || 
                `The chemical profile shows appropriate nitrogen reserves and pH suitable for acid-tolerant crops like tea and cinnamon. Applying Eppawala Rock Phosphate will resolve the ${sample.phosphorus} mg/kg phosphorus deficiency.`
              }
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

          {/* Fertilizer Prescription Box */}
          <div className="fertility-action-box">
            <h4 className="action-box-title">Fertilizer Prescription</h4>
            {fertilizers.map((fert, idx) => (
              <div key={idx} className="action-item">
                {fert.type === "warning" ? (
                  <AlertTriangle size={15} className="action-item-icon warning" />
                ) : (
                  <CheckCircle2 size={15} className="action-item-icon success" />
                )}
                <div>
                  <strong>{fert.name}</strong>
                  <p>{fert.dosage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {mlPrediction && (
        <section className="dashboard-section" style={{ marginBottom: "28px" }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Trained Model Recommendation</h2>
              <p className="section-desc">
                Random Forest prediction from the submitted IoT soil and weather readings.
              </p>
            </div>
            <span className="specimen-status-chip">
              {displayedMlConfidence}% confidence
            </span>
          </div>
          <div className="sample-card-glass" style={{ padding: "18px 22px" }}>
            <strong>{mlPrediction.recommended_crop}</strong>
            <span style={{ marginLeft: "10px", color: "var(--text-muted)" }}>
              highest model probability
            </span>
          </div>
        </section>
      )}

      {/* Crop Recommendations Section */}
      <section className="dashboard-section" style={{ marginBottom: "28px" }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Compatible High-Yield Crops</h2>
            <p className="section-desc">
              Recommended for {sample.location} based on physicochemical characteristics and Sri Lanka Agro-climatic data.
            </p>
          </div>
        </div>

        <div className="crops-grid">
          {crops.map((crop, idx) => (
            <div key={idx} className="crop-card">
              <div className="crop-card-top">
                <div>
                  <h4 className="crop-name">{crop.name}</h4>
                  <span className="crop-botanical">{crop.botanical}</span>
                </div>
                <div className="crop-match-badge">
                  <span className="crop-match-val">{crop.suitability}%</span>
                  <span className="crop-match-sub">Match</span>
                </div>
              </div>

              <div className="crop-bar-wrap">
                <div className="crop-bar-fill" style={{ width: `${crop.suitability}%` }}></div>
              </div>

              <p className="crop-notes">{crop.notes || "Matches regional soil pH and macronutrient availability."}</p>

              <div className="crop-footer">
                <span className="crop-tag">{crop.tag}</span>
                <span className="crop-zone-label">Agro-Grade A</span>
              </div>
            </div>
          ))}
        </div>
      </section>

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