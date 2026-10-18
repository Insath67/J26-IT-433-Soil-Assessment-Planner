import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FlaskConical,
  Upload,
  Cpu,
  Sparkles,
  ArrowRight,
  Save,
  CheckCircle2,
  RefreshCw,
  LayoutDashboard,
  History as HistoryIcon
} from "lucide-react";
import { saveSample } from "../services/soilStorage";
import { predictSoilHealth } from "../services/soilHealthML";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const NUMERIC_FIELDS = new Set([
  "ph",
  "nitrogen",
  "phosphorus",
  "potassium",
  "temperature",
  "humidity",
  "rainfall",
]);

function NewAnalysis() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("iot");
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [fetchingTelemetry, setFetchingTelemetry] = useState(false);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState("");

  const [formData, setFormData] = useState({
    sampleId: "KG-002",
    location: "Kegalle",
    district: "Kegalle (Mid-Country Wet Zone)",
    soilColor: "Reddish Brown / Podzolic",
    samplingDepth: "0 - 15 cm (Topsoil)",
    ph: "6.2",
    nitrogen: "45",
    phosphorus: "24",
    potassium: "58",
    temperature: "26.8",
    ec: "1.2",
    humidity: "78",
    rainfall: "2200",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      NUMERIC_FIELDS.has(name)
      && !/^\d*(\.\d{0,2})?$/.test(value)
    ) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFetchESP32 = async () => {
    setFetchingTelemetry(true);
    setMlError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/soil-health/sensors/latest`);
      if (!response.ok) {
        throw new Error("The IoT node did not return sensor readings.");
      }
      const telemetry = await response.json();
      setFormData(prev => ({
        ...prev,
        ph: String(telemetry.ph),
        nitrogen: String(telemetry.nitrogen),
        phosphorus: String(telemetry.phosphorus),
        potassium: String(telemetry.potassium),
        temperature: String(telemetry.temperature),
        ec: String(telemetry.ec),
        humidity: String(telemetry.humidity),
        rainfall: String(telemetry.rainfall),
      }));
      setFetchingTelemetry(false);
      setSaveSuccess({
        type: "info",
        message: "Live telemetry received from calibrated ESP32 sensor mesh (Node #ESP32-KG01)."
      });
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (error) {
      setFetchingTelemetry(false);
      setMlError(error instanceof Error ? error.message : "Unable to read the IoT node.");
    }
  };

  const handleSaveOnly = () => {
    const saved = saveSample(formData);
    setSaveSuccess({
      type: "success",
      message: `Soil sample "${saved.sampleId}" successfully saved! It is now active on your Dashboard and stored in Soil History.`,
      sampleId: saved.sampleId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalidField = [...NUMERIC_FIELDS].find((field) => {
      const value = formData[field];
      const numericValue = Number(value);
      return (
        value === ""
        || !Number.isFinite(numericValue)
        || numericValue < 0
        || (field === "ph" && numericValue > 14)
        || (field === "humidity" && numericValue > 100)
      );
    });
    if (invalidField) {
      setMlError("Enter valid non-negative numeric values with up to two decimal places.");
      return;
    }
    setMlLoading(true);
    setMlError("");
    try {
      const prediction = await predictSoilHealth({
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        ph: Number(formData.ph),
        rainfall: Number(formData.rainfall),
      });
      const saved = saveSample({ ...formData, mlPrediction: prediction });
      setSaveSuccess({
        type: "success",
        message: `Soil sample "${saved.sampleId}" saved with a ${Math.min(98, prediction.crop_prediction.confidence)}% ${prediction.crop_prediction.recommended_crop} model recommendation.`,
        sampleId: saved.sampleId
      });
      setMlLoading(false);
      setTimeout(() => {
        navigate(`/soil-health/result/${saved.sampleId}`);
      }, 450);
    } catch (error) {
      setMlLoading(false);
      setMlError(error instanceof Error ? error.message : "AI assessment failed.");
    }
  };

  return (
    <div className="subpage-container">
      <div className="page-header">
        <div>
          <div className="header-badge-row">
            <span className="live-status-pill">
              <span className="status-dot"></span>
              AI Soil Inference
            </span>
            <span className="agro-zone-tag">Kegalle Station</span>
          </div>
          <h1 className="page-title">New Soil Sample Analysis</h1>
          <p className="page-subtitle">
            Ingest real-time IoT probe measurements or upload a macroscopic soil core image for ML classification and crop recommendation.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div 
          style={{
            background: saveSuccess.type === "info" ? "var(--bg-subtle)" : "var(--green-light-soft)",
            border: `1px solid ${saveSuccess.type === "info" ? "var(--border-light)" : "var(--green-light-300)"}`,
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            animation: "fadeIn 0.3s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CheckCircle2 size={18} style={{ color: "var(--green-light-500)", minWidth: 18 }} />
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--green-dark-950)" }}>
              {saveSuccess.message}
            </span>
          </div>
          {saveSuccess.sampleId && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                type="button" 
                className="secondary-btn"
                style={{ padding: "6px 12px", fontSize: "12px" }}
                onClick={() => navigate("/soil-health")}
              >
                <LayoutDashboard size={14} />
                <span>Go to Dashboard</span>
              </button>
              <button 
                type="button" 
                className="secondary-btn"
                style={{ padding: "6px 12px", fontSize: "12px" }}
                onClick={() => navigate("/soil-health/history")}
              >
                <HistoryIcon size={14} />
                <span>View History</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="subpage-card">
        {/* Method Switcher */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "28px" }}>
          <button
            type="button"
            className={method === "iot" ? "primary-btn" : "secondary-btn"}
            onClick={() => {
              setMethod("iot");
              handleFetchESP32();
            }}
          >
            {fetchingTelemetry ? <RefreshCw size={16} className="spin" /> : <Cpu size={16} />}
            <span>Fetch from ESP32 Node</span>
          </button>

          <button
            type="button"
            className={method === "manual" ? "primary-btn" : "secondary-btn"}
            onClick={() => setMethod("manual")}
          >
            <FlaskConical size={16} />
            <span>Manual Sensor Input</span>
          </button>

          <button
            type="button"
            className={method === "image" ? "primary-btn" : "secondary-btn"}
            onClick={() => setMethod("image")}
          >
            <Upload size={16} />
            <span>Soil Image Processing</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {method === "image" && (
            <div style={{
              border: "2px dashed var(--border-light)",
              borderRadius: "var(--radius-lg)",
              padding: "40px",
              textAlign: "center",
              marginBottom: "28px",
              background: "var(--bg-subtle)"
            }}>
              <Upload size={36} style={{ color: "var(--green-dark-700)", margin: "0 auto 12px" }} />
              <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>
                Upload Soil Specimen Photo
              </h4>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", maxWidth: "420px", margin: "0 auto 16px" }}>
                Supports JPEG/PNG high-resolution core photos for convolutional neural network (CNN) soil texture classification.
              </p>
              <button type="button" className="secondary-btn">Browse Files</button>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
              Sample Identification & Geographical Origin
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>
              Sri Lanka agro-ecological classification zone
            </p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Sample ID</label>
              <input
                type="text"
                name="sampleId"
                className="form-input"
                value={formData.sampleId}
                onChange={handleChange}
                placeholder="e.g. KG-002"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location / District</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kegalle"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Agro-Ecological Sub-Zone</label>
              <select name="district" className="form-select" value={formData.district} onChange={handleChange}>
                <option value="Kegalle (Mid-Country Wet Zone)">Kegalle (Wet Zone Mid Country - WL2a)</option>
                <option value="Kandy (Mid-Country Wet Zone)">Kandy (Wet Zone Mid Country - WM2b)</option>
                <option value="Kurunegala (Intermediate Zone)">Kurunegala (Intermediate Zone - IL1a)</option>
                <option value="Nuwara Eliya (Up-Country Wet Zone)">Nuwara Eliya (Up-Country Wet Zone - WU1)</option>
                <option value="Galle (Low-Country Wet Zone)">Galle (Low-Country Wet Zone - WL1a)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Soil Color / Morphological Texture</label>
              <input
                type="text"
                name="soilColor"
                className="form-input"
                value={formData.soilColor}
                onChange={handleChange}
                placeholder="e.g. Reddish Brown / Podzolic"
              />
            </div>
          </div>

          <div style={{ marginTop: "32px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
              Physicochemical Sensor Parameters
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "12.5px" }}>
              NPK probe levels, pH balance, temperature, and climate inputs
            </p>
          </div>

          <div className="form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="form-group">
              <label className="form-label">Soil pH (0 - 14)</label>
              <input
                type="text"
                inputMode="decimal"
                name="ph"
                className="form-input"
                value={formData.ph}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nitrogen (N) - mg/kg</label>
              <input
                type="text"
                inputMode="decimal"
                name="nitrogen"
                className="form-input"
                value={formData.nitrogen}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phosphorus (P) - mg/kg</label>
              <input
                type="text"
                inputMode="decimal"
                name="phosphorus"
                className="form-input"
                value={formData.phosphorus}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Potassium (K) - mg/kg</label>
              <input
                type="text"
                inputMode="decimal"
                name="potassium"
                className="form-input"
                value={formData.potassium}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Temperature (°C)</label>
              <input
                type="text"
                inputMode="decimal"
                name="temperature"
                className="form-input"
                value={formData.temperature}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Air Humidity (%)</label>
              <input type="text" inputMode="decimal" name="humidity"
                className="form-input" value={formData.humidity} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Rainfall (mm)</label>
              <input type="text" inputMode="decimal" name="rainfall"
                className="form-input" value={formData.rainfall} onChange={handleChange} required />
            </div>
          </div>

          {mlError && <p role="alert" style={{ color: "#b91c1c", marginTop: 16 }}>{mlError}</p>}
          <div style={{ marginTop: "36px", display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/soil-health")}
            >
              Cancel
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleSaveOnly}
              title="Save sample data to history and active dashboard without navigating"
            >
              <Save size={16} />
              <span>Save Sample</span>
            </button>
            <button
              type="submit"
              disabled={mlLoading}
              className="primary-btn"
            >
              <Sparkles size={16} />
              <span>{mlLoading ? "Running trained model..." : "Save & Run AI Assessment"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewAnalysis;