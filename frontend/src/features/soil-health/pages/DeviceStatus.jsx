import {
  Cpu,
  Wifi,
  Battery,
  CheckCircle2,
  RefreshCw,
  Clock
} from "lucide-react";

function DeviceStatus() {
  const sensors = [
    { name: "7-in-1 NPK Soil Modbus Probe", protocol: "RS-485 / Modbus RTU", status: "Calibrated & Online", health: "100%" },
    { name: "Glass pH Industrial Electrode", protocol: "Analog ADC (GPIO 34)", status: "Optimal Precision", health: "98%" },
    { name: "Capacitive Soil Moisture Probe v2", protocol: "Analog ADC (GPIO 35)", status: "Active Reading", health: "95%" },
    { name: "DS18B20 Waterproof Temp Probe", protocol: "1-Wire Digital (GPIO 4)", status: "Stable", health: "99%" },
  ];

  return (
    <div className="subpage-container">
      <div className="page-header">
        <div>
          <div className="header-badge-row">
            <span className="live-status-pill">
              <span className="status-dot"></span>
              Hardware Telemetry
            </span>
            <span className="agro-zone-tag">Kegalle Field Unit #01</span>
          </div>
          <h1 className="page-title">IoT Field Device Status</h1>
          <p className="page-subtitle">
            Diagnostics and communication health of the ESP32 microcontroller and sensor probe array.
          </p>
        </div>

        <button className="primary-btn" onClick={() => window.location.reload()}>
          <RefreshCw size={15} />
          <span>Ping Device</span>
        </button>
      </div>

      {/* Device Overview Banner */}
      <div className="sample-card-glass" style={{ marginBottom: "24px" }}>
        <div className="sample-grid">
          <div className="sample-meta-cell">
            <span className="meta-label">Microcontroller</span>
            <div className="meta-value-row">
              <Cpu size={16} className="text-dark-green" />
              <strong className="meta-value">ESP32-WROOM-32</strong>
            </div>
            <span className="meta-sub">Dual Core 240MHz</span>
          </div>

          <div className="sample-meta-cell">
            <span className="meta-label">Wireless Connectivity</span>
            <div className="meta-value-row">
              <Wifi size={16} className="text-light-green" />
              <strong className="meta-value">WiFi 2.4GHz / LoRa</strong>
            </div>
            <span className="meta-sub">Signal: -58 dBm (Strong)</span>
          </div>

          <div className="sample-meta-cell">
            <span className="meta-label">Power & Solar Battery</span>
            <div className="meta-value-row">
              <Battery size={16} className="text-dark-green" />
              <strong className="meta-value">3.7V Li-Ion • 94%</strong>
            </div>
            <span className="meta-sub">Solar Charging Active</span>
          </div>

          <div className="sample-meta-cell">
            <span className="meta-label">Uptime & Heartbeat</span>
            <div className="meta-value-row">
              <Clock size={16} className="text-dark-green" />
              <strong className="meta-value">14 Days, 6 Hours</strong>
            </div>
            <span className="meta-sub">Packet Loss: 0.02%</span>
          </div>
        </div>
      </div>

      {/* Sensor Array Status */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Connected Soil Probes</h2>
          <p className="section-desc">Hardware channel allocation and sensor bus health.</p>
        </div>
      </div>

      <div className="table-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Probe Description</th>
              <th>Hardware Protocol / Pin</th>
              <th>Operational Status</th>
              <th>Sensor Calibration Health</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor, idx) => (
              <tr key={idx}>
                <td>
                  <div className="table-nutrient-col">
                    <span className="nutrient-dot dot-n"></span>
                    <div>
                      <strong>{sensor.name}</strong>
                    </div>
                  </div>
                </td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px" }}>
                  {sensor.protocol}
                </td>
                <td>
                  <span className="status-pill status-sufficient">
                    <CheckCircle2 size={13} />
                    {sensor.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "160px" }}>
                    <div style={{ flex: 1, height: "6px", background: "var(--border-subtle)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: sensor.health, height: "100%", background: "var(--green-light-500)", borderRadius: "999px" }}></div>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700" }}>{sensor.health}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeviceStatus;