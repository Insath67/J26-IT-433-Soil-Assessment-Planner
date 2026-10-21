import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FlaskConical,
  History,
  Cpu,
  Sprout,
  Activity,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Sprout size={24} strokeWidth={2.5} />
        </div>
        <div className="logo-text">
          <div className="logo-title-row">
            <h2>Smart Soil</h2>
            <span className="logo-badge">LK</span>
          </div>
          <p>AI Soil & Crop System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-group-label">MAIN NAVIGATION</div>

        <NavLink
          to="/soil-health"
          end
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <div className="nav-item-left">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </div>
          <span className="nav-tag active-tag">LIVE</span>
        </NavLink>

        <NavLink
          to="/soil-health/analysis"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <div className="nav-item-left">
            <FlaskConical size={19} />
            <span>New Analysis</span>
          </div>
          <span className="nav-tag">AI</span>
        </NavLink>

        <NavLink
          to="/soil-health/history"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <div className="nav-item-left">
            <History size={19} />
            <span>Soil History</span>
          </div>
        </NavLink>

        <NavLink
          to="/soil-health/device"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <div className="nav-item-left">
            <Cpu size={19} />
            <span>Device Status</span>
          </div>
          <span className="nav-dot-active" title="ESP32 Online"></span>
        </NavLink>

        <div className="nav-group-label" style={{ marginTop: "14px" }}>PORTAL NAVIGATION</div>
        <NavLink
          to="/"
          className="nav-item"
        >
          <div className="nav-item-left">
            <ArrowLeft size={19} />
            <span>Verdant Home</span>
          </div>
        </NavLink>
      </nav>

      {/* IoT Quick Node Status Box */}
      <div className="sidebar-iot-card">
        <div className="iot-card-header">
          <Activity size={14} className="iot-icon-pulse" />
          <span>IoT Sensor Mesh</span>
        </div>
        <div className="iot-node-info">
          <div className="iot-node-row">
            <span className="iot-label">Node:</span>
            <span className="iot-val">ESP32-KG01</span>
          </div>
          <div className="iot-node-row">
            <span className="iot-label">Station:</span>
            <span className="iot-val">Kegalle Central</span>
          </div>
          <div className="iot-status-indicator">
            <CheckCircle2 size={13} className="text-light-green" />
            <span>7 Sensors Calibrated</span>
          </div>
        </div>
      </div>

      {/* Research Project Footer */}
      <div className="sidebar-footer">
        <div className="footer-tag">FINAL YEAR RESEARCH</div>
        <strong className="footer-id">IT23247154</strong>
        <p className="footer-desc">SLIIT Agri-Tech ML Initiative</p>
      </div>
    </aside>
  );
}

export default Sidebar;