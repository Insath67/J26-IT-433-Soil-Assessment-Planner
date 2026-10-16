import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FlaskConical,
  Droplets,
  Thermometer,
  Zap,
  Leaf,
  MapPin,
  CalendarDays,
  Plus,
  Layers,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  FileDown,
} from "lucide-react";

import SensorCard from "../components/SensorCard";
import FertilityCard from "../components/FertilityCard";
import { getActiveSample, getAllSamples, setActiveSample } from "../services/soilStorage";
import { downloadSoilReportPdf } from "../services/pdfGenerator";

function Dashboard() {
  const [soilData, setSoilData] = useState(() => getActiveSample());
  const [allSamples, setAllSamples] = useState(() => getAllSamples());

  // Listen for storage updates and sample changes
  useEffect(() => {
    const handleUpdate = () => {
      setSoilData(getActiveSample());
      setAllSamples(getAllSamples());
    };

    window.addEventListener("soil_data_updated", handleUpdate);
    window.addEventListener("soil_sample_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("soil_data_updated", handleUpdate);
      window.removeEventListener("soil_sample_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleSelectSample = (e) => {
    const selectedId = e.target.value;
    setActiveSample(selectedId);
    setSoilData(getActiveSample());
  };

  const handleDownloadPdf = () => {
    downloadSoilReportPdf(soilData);
  };

  // Crop recommendations from active sample
  const crops = soilData.crops || [
    {
      name: "Ceylon Tea",
      botanical: "Camellia sinensis",
      suitability: 94,
      tag: "Highly Suitable",
      notes: "Optimal pH and moisture for vegetative flush in mid-country hills.",
    },
    {
      name: "Ceylon Cinnamon",
      botanical: "Cinnamomum verum",
      suitability: 89,
      tag: "Highly Suitable",
      notes: "Well-suited for well-drained soil; thrives with potassium levels.",
    },
    {
      name: "Black Pepper",
      botanical: "Piper nigrum",
      suitability: 85,
      tag: "Suitable",
      notes: "Phosphorus supplementation recommended to boost root establishment.",
    },
    {
      name: "Rubber",
      botanical: "Hevea brasiliensis",
      suitability: 81,
      tag: "Suitable",
      notes: "Adapted to regional agro-climatic conditions and soil moisture.",
    },
  ];

  // Nutrient status helpers
  const nStatus = soilData.nutrientStatus?.nitrogen || (soilData.nitrogen < 30 ? "Deficient" : "Sufficient");
  const pStatus = soilData.nutrientStatus?.phosphorus || (soilData.phosphorus < 35 ? "Deficient" : "Sufficient");
  const kStatus = soilData.nutrientStatus?.potassium || (soilData.potassium < 40 ? "Deficient" : "Sufficient");
  const phStatus = soilData.nutrientStatus?.ph || (soilData.ph < 5.5 ? "Acidic Alert" : "Suitable");

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-titles">
          <div className="header-badge-row">
            <span className="live-status-pill">
              <span className="status-dot"></span>
              Live IoT Telemetry
            </span>
            <span className="agro-zone-tag">{soilData.district || "Wet Zone WL2a"}</span>
          </div>
          <h1 className="page-title">Soil Fertility Dashboard</h1>
          <p className="page-subtitle">
            Real-time IoT sensor telemetry, image-processing soil assessment & AI crop recommendations for Sri Lanka.
          </p>
        </div>

        <div className="header-actions">
          {/* Specimen Switcher */}
          <div className="specimen-selector-wrap" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>
              Active Specimen:
            </span>
            <select
              value={soilData.sampleId}
              onChange={handleSelectSample}
              className="form-select"
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: "700",
                background: "var(--white)",
                border: "1px solid var(--green-light-300)",
                color: "var(--green-dark-800)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer"
              }}
            >
              {allSamples.map((s) => (
                <option key={s.sampleId} value={s.sampleId}>
                  {s.sampleId} — {s.location} ({s.date})
                </option>
              ))}
            </select>
          </div>

          <button 
            className="secondary-btn"
            onClick={handleDownloadPdf}
            title="Download PDF assessment report for active specimen"
          >
            <FileDown size={16} />
            <span>Download PDF</span>
          </button>

          <Link to="/soil-health/analysis" className="primary-btn">
            <Plus size={17} strokeWidth={2.5} />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Latest Soil Sample Specimen Card */}
      <section className="dashboard-section sample-section">
        <div className="section-header-compact">
          <div className="section-title-wrap">
            <Layers size={17} className="text-dark-green" />
            <h3 className="section-title">Active Soil Sample Specimen</h3>
          </div>
          <span className="specimen-status-chip">
            <CheckCircle size={13} />
            Verified Field Specimen
          </span>
        </div>

        <div className="sample-card-glass">
          <div className="sample-grid">
            {/* Sample ID */}
            <div className="sample-meta-cell">
              <span className="meta-label">Sample ID</span>
              <div className="meta-value-row">
                <span className="sample-badge-id">{soilData.sampleId}</span>
              </div>
              <span className="meta-sub">Specimen Ref Verified</span>
            </div>

            {/* Location */}
            <div className="sample-meta-cell">
              <span className="meta-label">Location / Agro-Zone</span>
              <div className="meta-value-row">
                <MapPin size={16} className="text-dark-green" />
                <strong className="meta-value">{soilData.location}</strong>
              </div>
              <span className="meta-sub">{soilData.regionDetails || soilData.district}</span>
            </div>

            {/* Soil Classification */}
            <div className="sample-meta-cell">
              <span className="meta-label">Soil Classification</span>
              <div className="meta-value-row">
                <Leaf size={16} className="text-light-green" />
                <strong className="meta-value">{soilData.soilType || soilData.soilColor}</strong>
              </div>
              <span className="meta-sub">Depth: {soilData.samplingDepth || "0 - 15 cm (Topsoil)"}</span>
            </div>

            {/* Timestamp */}
            <div className="sample-meta-cell">
              <span className="meta-label">Timestamp</span>
              <div className="meta-value-row">
                <CalendarDays size={16} className="text-dark-green" />
                <strong className="meta-value">{soilData.date}</strong>
              </div>
              <span className="meta-sub">{soilData.time} Local Ingestion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Soil Measurements Grid */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Soil Measurements</h2>
            <p className="section-desc">
              Real-time physicochemical readings captured by calibrated IoT sensor nodes.
            </p>
          </div>
          <span className="sensor-count-badge">7 Sensors Active</span>
        </div>

        <div className="sensor-grid">
          <SensorCard
            name="Soil pH"
            chemicalSymbol="pH"
            value={soilData.ph}
            status={phStatus}
            targetRange="5.8 - 6.8"
            progressPercent={Math.min(100, Math.round((soilData.ph / 14) * 100))}
            icon={<FlaskConical size={20} />}
          />

          <SensorCard
            name="Nitrogen"
            chemicalSymbol="N"
            value={soilData.nitrogen}
            unit="mg/kg"
            status={nStatus}
            targetRange="30 - 50 mg/kg"
            progressPercent={Math.min(100, Math.round((soilData.nitrogen / 60) * 100))}
            icon={<Leaf size={20} />}
          />

          <SensorCard
            name="Phosphorus"
            chemicalSymbol="P"
            value={soilData.phosphorus}
            unit="mg/kg"
            status={pStatus}
            targetRange="35 - 55 mg/kg"
            progressPercent={Math.min(100, Math.round((soilData.phosphorus / 60) * 100))}
            icon={<Leaf size={20} />}
          />

          <SensorCard
            name="Potassium"
            chemicalSymbol="K"
            value={soilData.potassium}
            unit="mg/kg"
            status={kStatus}
            targetRange="40 - 70 mg/kg"
            progressPercent={Math.min(100, Math.round((soilData.potassium / 80) * 100))}
            icon={<Leaf size={20} />}
          />

          <SensorCard
            name="Moisture"
            chemicalSymbol="H₂O"
            value={soilData.moisture}
            unit="%"
            status="Optimal"
            targetRange="55 - 75%"
            progressPercent={Math.min(100, Math.round(soilData.moisture))}
            icon={<Droplets size={20} />}
          />

          <SensorCard
            name="Temperature"
            chemicalSymbol="°C"
            value={soilData.temperature}
            unit="°C"
            status="Optimal"
            targetRange="22 - 30 °C"
            progressPercent={Math.min(100, Math.round((soilData.temperature / 40) * 100))}
            icon={<Thermometer size={20} />}
          />

          <SensorCard
            name="Conductivity"
            chemicalSymbol="EC"
            value={soilData.ec || 1.2}
            unit="mS/cm"
            status="Normal"
            targetRange="< 2.0 mS/cm"
            progressPercent={Math.min(100, Math.round(((soilData.ec || 1.2) / 3.0) * 100))}
            icon={<Zap size={20} />}
          />
        </div>
      </section>

      {/* Fertility Assessment Card */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Fertility Assessment</h2>
            <p className="section-desc">
              Comprehensive Machine Learning health index calculated across macronutrient and physical attributes.
            </p>
          </div>
        </div>

        <FertilityCard
          status={soilData.fertility}
          score={soilData.fertilityScore}
          sampleId={soilData.sampleId}
        />
      </section>

      {/* Nutrient Benchmark Table */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Nutrient Matrix & Agronomic Benchmarks</h2>
            <p className="section-desc">
              Comparison of observed levels against Department of Agriculture Sri Lanka standards.
            </p>
          </div>
        </div>

        <div className="table-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Nutrient / Parameter</th>
                <th>Measured Reading</th>
                <th>Ideal Benchmark Range</th>
                <th>Assessment Status</th>
                <th>Agronomist Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="table-nutrient-col">
                    <span className="nutrient-dot dot-n"></span>
                    <div>
                      <strong>Nitrogen (N)</strong>
                      <span className="sub-label">Essential for vegetative growth</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="table-value">{soilData.nitrogen} mg/kg</span>
                </td>
                <td>30 – 50 mg/kg</td>
                <td>
                  <span className={`status-pill ${nStatus === "Deficient" ? "status-deficient" : "status-sufficient"}`}>
                    {nStatus === "Deficient" ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                    {nStatus}
                  </span>
                </td>
                <td className="table-recommendation">
                  {nStatus === "Deficient" 
                    ? "Below target. Apply urea or organic compost top-dressing to replenish vegetative flush."
                    : "Adequate for vegetative development. Maintain standard urea or organic compost top-dressing."}
                </td>
              </tr>

              <tr>
                <td>
                  <div className="table-nutrient-col">
                    <span className="nutrient-dot dot-p"></span>
                    <div>
                      <strong>Phosphorus (P)</strong>
                      <span className="sub-label">Root vigor and flowering</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`table-value ${pStatus === "Deficient" ? "text-attention" : ""}`}>
                    {soilData.phosphorus} mg/kg
                  </span>
                </td>
                <td>35 – 55 mg/kg</td>
                <td>
                  <span className={`status-pill ${pStatus === "Deficient" ? "status-deficient" : "status-sufficient"}`}>
                    {pStatus === "Deficient" ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                    {pStatus}
                  </span>
                </td>
                <td className={`table-recommendation ${pStatus === "Deficient" ? "text-attention-desc" : ""}`}>
                  {pStatus === "Deficient"
                    ? "Below target. Apply Eppawala Rock Phosphate (ERP) or DAP at planting to strengthen root networks."
                    : "Optimum reserve. Promotes healthy root architecture and fruit setting in Sri Lankan crops."}
                </td>
              </tr>

              <tr>
                <td>
                  <div className="table-nutrient-col">
                    <span className="nutrient-dot dot-k"></span>
                    <div>
                      <strong>Potassium (K)</strong>
                      <span className="sub-label">Disease resistance & water regulation</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="table-value">{soilData.potassium} mg/kg</span>
                </td>
                <td>40 – 70 mg/kg</td>
                <td>
                  <span className={`status-pill ${kStatus === "Deficient" ? "status-deficient" : "status-sufficient"}`}>
                    {kStatus === "Deficient" ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                    {kStatus}
                  </span>
                </td>
                <td className="table-recommendation">
                  {kStatus === "Deficient"
                    ? "Low potassium level. Supplement with Muriate of Potash (MOP) to boost stress tolerance."
                    : "Favorable level. Supports drought resistance and cellular transport. Continue periodic MOP schedule."}
                </td>
              </tr>

              <tr>
                <td>
                  <div className="table-nutrient-col">
                    <span className="nutrient-dot dot-ph"></span>
                    <div>
                      <strong>Soil Reaction (pH)</strong>
                      <span className="sub-label">Nutrient bioavailability index</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="table-value">{soilData.ph}</span>
                </td>
                <td>5.8 – 6.8</td>
                <td>
                  <span className={`status-pill ${phStatus === "Acidic Alert" ? "status-deficient" : "status-suitable"}`}>
                    {phStatus === "Acidic Alert" ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                    {phStatus}
                  </span>
                </td>
                <td className="table-recommendation">
                  {phStatus === "Acidic Alert"
                    ? "Strongly acidic. Apply Agricultural Dolomite (500 kg/ha) to neutralize soil acidity and supply Mg."
                    : "Slightly acidic to near neutral. Optimal for nutrient absorption in Sri Lankan Wet/Intermediate zones."}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Sri Lanka Crop Recommendations (ML Guidance) */}
      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <div className="section-tag-row">
              <span className="ai-pill">
                <Award size={13} />
                ML Recommendation Model
              </span>
            </div>
            <h2 className="section-title">Top Crop Recommendations for this Soil Profile</h2>
            <p className="section-desc">
              Ranked predictions based on N-P-K concentrations, pH {soilData.ph}, {soilData.soilType || "RYP"} soil, and {soilData.location} climate.
            </p>
          </div>

          <Link to={`/soil-health/result/${soilData.sampleId}`} className="view-more-link">
            <span>Detailed Agro-Report</span>
            <ArrowRight size={14} />
          </Link>
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
                <div 
                  className="crop-bar-fill" 
                  style={{ width: `${crop.suitability}%` }}
                ></div>
              </div>

              <p className="crop-notes">{crop.notes}</p>

              <div className="crop-footer">
                <span className="crop-tag">{crop.tag}</span>
                <span className="crop-zone-label">{soilData.location} Compatible</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Quick Actions */}
      <div className="dashboard-actions-panel">
        <div className="action-panel-text">
          <h3>Ready to test a new field sample?</h3>
          <p>Collect IoT sensor probes or upload macroscopic soil photos for instant analysis.</p>
        </div>
        <div className="action-buttons-group">
          <Link to="/soil-health/analysis" className="primary-btn">
            <Plus size={16} />
            <span>Start New Analysis</span>
          </Link>
          <Link to="/soil-health/history" className="secondary-btn">
            <span>View Sample History</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;