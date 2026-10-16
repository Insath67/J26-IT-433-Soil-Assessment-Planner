import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  CheckCircle,
  Eye,
  Plus,
  FileDown,
  LayoutDashboard,
  Trash2,
  Search
} from "lucide-react";
import { getAllSamples, setActiveSample, deleteSample } from "../services/soilStorage";
import { downloadSoilReportPdf } from "../services/pdfGenerator";

function History() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState(() => getAllSamples());
  const [searchTerm, setSearchTerm] = useState("");

  const refreshData = useCallback(() => {
    setHistoryData(getAllSamples());
  }, []);

  useEffect(() => {
    window.addEventListener("soil_data_updated", refreshData);
    window.addEventListener("storage", refreshData);
    return () => {
      window.removeEventListener("soil_data_updated", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, []);

  const handleViewInDashboard = (sampleId) => {
    setActiveSample(sampleId);
    navigate("/soil-health");
  };

  const handleDownloadPdf = (sample) => {
    downloadSoilReportPdf(sample);
  };

  const handleDelete = (sampleId) => {
    if (window.confirm(`Are you sure you want to remove sample ${sampleId} from history?`)) {
      deleteSample(sampleId);
      refreshData();
    }
  };

  const filteredData = historyData.filter(row => {
    const term = searchTerm.toLowerCase();
    return (
      (row.sampleId && row.sampleId.toLowerCase().includes(term)) ||
      (row.location && row.location.toLowerCase().includes(term)) ||
      (row.district && row.district.toLowerCase().includes(term)) ||
      (row.crop && row.crop.toLowerCase().includes(term))
    );
  });

  return (
    <div className="subpage-container">
      <div className="page-header">
        <div>
          <div className="header-badge-row">
            <span className="live-status-pill">
              <span className="status-dot"></span>
              Historical Repository
            </span>
            <span className="agro-zone-tag">{historyData.length} Verified Records</span>
          </div>
          <h1 className="page-title">Soil Analysis History</h1>
          <p className="page-subtitle">
            Archive of field sensor readings, physicochemical measurements, and corresponding ML crop advisories.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link to="/soil-health/analysis" className="primary-btn">
            <Plus size={16} />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", minWidth: "320px", flex: 1, maxWidth: "450px" }}>
          <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "40px" }}
            placeholder="Search by Sample ID, District, or Crop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600" }}>
          Showing {filteredData.length} of {historyData.length} specimens
        </span>
      </div>

      <div className="table-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Sample ID</th>
              <th>Location / Agro-Zone</th>
              <th>Timestamp</th>
              <th>pH Value</th>
              <th>Fertility Rating</th>
              <th>Recommended Crops</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No soil analysis records match your search criteria.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.sampleId}>
                  <td>
                    <span className="sample-badge-id" style={{ fontSize: "13px", padding: "3px 8px" }}>
                      {row.sampleId}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <MapPin size={14} className="text-dark-green" />
                      <strong>{row.location}</strong>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        ({row.district || row.regionDetails || "WL2a"})
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)" }}>
                      <CalendarDays size={14} />
                      <span>{row.date}</span>
                    </div>
                  </td>
                  <td>
                    <span className="table-value">{row.ph}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${row.fertility === "High" ? "status-sufficient" : "status-suitable"}`}>
                      <CheckCircle size={12} />
                      {row.fertility} ({row.fertilityScore || 74}%)
                    </span>
                  </td>
                  <td style={{ fontWeight: "600", color: "var(--green-dark-800)" }}>
                    {row.crop || (row.crops ? row.crops.slice(0, 2).map(c => c.name).join(", ") : "Ceylon Tea, Cinnamon")}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(row)}
                        className="secondary-btn"
                        style={{ padding: "6px 10px", fontSize: "12px", color: "var(--green-dark-800)" }}
                        title="Download PDF Report"
                      >
                        <FileDown size={14} />
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleViewInDashboard(row.sampleId)}
                        className="secondary-btn"
                        style={{ padding: "6px 10px", fontSize: "12px" }}
                        title="Load into Dashboard"
                      >
                        <LayoutDashboard size={13} />
                        <span>Dashboard</span>
                      </button>

                      <Link
                        to={`/soil-health/result/${row.sampleId}`}
                        className="secondary-btn"
                        style={{ padding: "6px 10px", fontSize: "12px" }}
                        title="Full Detailed Analysis"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(row.sampleId)}
                        className="secondary-btn"
                        style={{ padding: "6px 8px", fontSize: "12px", color: "#dc2626" }}
                        title="Delete Sample"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;