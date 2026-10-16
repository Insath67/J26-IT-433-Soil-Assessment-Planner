import { Wifi, User, RefreshCw, MapPin } from "lucide-react";

function Navbar() {
  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <div className="system-title-badge">
          <span className="live-pill">SRI LANKA AGRO-TECH</span>
          <h2 className="navbar-heading">Soil Assessment System</h2>
        </div>
        <div className="location-chip">
          <MapPin size={13} className="location-chip-icon" />
          <span>Kegalle Station (WL2a)</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="connection-status" title="Connected to field IoT sensor array">
          <span className="pulse-dot"></span>
          <Wifi size={15} />
          <span>ESP32 IoT Online</span>
        </div>

        <button 
          className="sync-button" 
          title="Refresh IoT Sensor Readings"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={14} />
          <span>Sync</span>
        </button>

        <div className="user-profile">
          <div className="avatar-circle">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">Researcher</span>
            <span className="user-role">SLIIT • IT23247154</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;