import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSample } from "../services/soilStorage";

const SOIL_TYPES = [
  "Deep acidic well-drained loam or clay loam",
  "Deep fertile well-drained loam or clay loam",
  "Deep well-drained loam or clay loam",
  "Fertile well-drained loam or sandy loam",
  "Organic-rich well-drained loam",
];

const ZONES = [
  "Kegalle (Wet Zone Mid Country - WL2a)",
  "Kandy (Mid-Country Wet Zone)",
  "Kurunegala (Intermediate Zone)",
  "Nuwara Eliya (Up-Country Wet Zone)",
  "Galle (Low-Country Wet Zone)",
];

// VITE_API_URL should be the server origin, e.g. http://127.0.0.1:8000
const API = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000")
  .replace(/\/$/, "")
  .replace(/\/api\/soil-health$/, "");

export default function NewAnalysis() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sampleId: "KG-002",
    location: "Kegalle",
    district: ZONES[0],
    soilType: SOIL_TYPES[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Get dataset-based nutrient predictions from FastAPI.
      const predictionResponse = await fetch(
        `${API}/api/soil-health/soil-type/predict`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sample_id: form.sampleId.trim(),
            location: form.location.trim(),
            agro_zone: form.district,
            soil_type: form.soilType,
          }),
        }
      );

      const prediction = await predictionResponse.json();
      if (!predictionResponse.ok) {
        throw new Error(
          typeof prediction.detail === "string"
            ? prediction.detail
            : "Soil nutrient prediction failed"
        );
      }

      // 2. Construct the SoilSample payload expected by schemas.py.
      // These are predicted values, NOT live IoT sensor measurements.
      const sampleData = {
        sampleId: form.sampleId.trim(),
        location: form.location.trim(),
        district: form.district,
        soilType: form.soilType,
        soilColor: form.soilType,
        sensorData: {
          ph: Number(prediction.ph),
          nitrogen: Number(prediction.nitrogen),
          phosphorus: Number(prediction.phosphorus),
          potassium: Number(prediction.potassium),
        },
        imageAnalysis: {
          source: "dataset_prediction",
          note: "N, P, K and pH are estimates, not physical sensor readings",
        },
      };

      // Prevent invalid or missing model predictions from being saved.
      const values = Object.values(sampleData.sensorData);
      if (
        values.some((value) => !Number.isFinite(value)) ||
        sampleData.sensorData.ph < 0 ||
        sampleData.sensorData.ph > 14
      ) {
        throw new Error("Prediction returned invalid nutrient values");
      }

      // 3. Save through FastAPI. MongoDB persistence must be enabled in
      // backend/app/features/soil_health/service.py for permanent storage.
      const saveResponse = await fetch(`${API}/api/soil-health/samples`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sampleData),
      });

      if (!saveResponse.ok) {
        const failure = await saveResponse.json().catch(() => ({}));
        const message =
          typeof failure.detail === "string"
            ? failure.detail
            : `Could not save soil sample (HTTP ${saveResponse.status})`;
        throw new Error(message);
      }

      const savedSample = await saveResponse.json();
      console.log("Saved through FastAPI:", savedSample);

      // 4. Preserve existing frontend result-page compatibility.
      const saved = saveSample({
        ...form,
        sampleId: savedSample.sampleId,
        soilColor: form.soilType,
        nitrogen: prediction.nitrogen,
        phosphorus: prediction.phosphorus,
        potassium: prediction.potassium,
        ph: prediction.ph,
        nutrientEstimate: true,
      });

      // 5. Navigate only after the API save succeeds.
      navigate(`/soil-health/result/${encodeURIComponent(saved.sampleId)}`, {
        state: { soilTypePrediction: prediction },
      });
    } catch (err) {
      setError(err.message || "Could not contact the backend server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="subpage-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Soil Nutrient Prediction</h1>
          <p className="page-subtitle">
            Estimate N, P, K and pH from a selected soil category. These are
            research dataset estimates, not sensor readings.
          </p>
        </div>
      </div>

      <div className="subpage-card">
        <form onSubmit={handleSubmit}>
          <h3>Sample Identification &amp; Geographical Origin</h3>
          <div className="form-grid" style={{ marginTop: 20 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="sampleId">Sample ID</label>
              <input
                id="sampleId"
                className="form-input"
                name="sampleId"
                value={form.sampleId}
                onChange={change}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="location">Location / District</label>
              <input
                id="location"
                className="form-input"
                name="location"
                value={form.location}
                onChange={change}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="district">Agro-Ecological Sub-Zone</label>
              <select
                id="district"
                className="form-select"
                name="district"
                value={form.district}
                onChange={change}
              >
                {ZONES.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="soilType">Soil Type</label>
              <select
                id="soilType"
                className="form-select"
                name="soilType"
                value={form.soilType}
                onChange={change}
              >
                {SOIL_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" style={{ color: "#b91c1c", marginTop: 16 }}>
              {error}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 32,
            }}
          >
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/soil-health")}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Estimating & Saving..." : "Predict Soil Nutrients →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
