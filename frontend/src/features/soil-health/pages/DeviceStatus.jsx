import {
  Cpu,
  Wifi,
  Battery,
  CheckCircle2,
  RefreshCw,
  Clock,
  PlugZap,
  FlaskConical,
  Droplets,
  Thermometer,
  Zap
} from "lucide-react";
import { useState } from "react";

function DeviceStatus() {
  const [connected, setConnected] = useState(false);
  const readings = [
    { name: "Soil pH", value: "6.4", unit: "", icon: FlaskConical },
    { name: "Nitrogen (N)", value: "42", unit: "mg/kg", icon: FlaskConical },
    { name: "Phosphorus (P)", value: "28", unit: "mg/kg", icon: FlaskConical },
    { name: "Potassium (K)", value: "55", unit: "mg/kg", icon: FlaskConical },
    { name: "Moisture", value: "63", unit: "%", icon: Droplets },
    { name: "Temperature", value: "27.5", unit: "°C", icon: Thermometer },
    { name: "Electrical Conductivity", value: "1.4", unit: "mS/cm", icon: Zap },
  ];
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

        <button className="primary-btn" onClick={() => setConnected(value => !value)}>
          {connected ? <RefreshCw size={15} /> : <PlugZap size={15} />}
          <span>{connected ? "Refresh Readings" : "Connect Device"}</span>
        </button>
      </div>

      <div className="sample-card-glass" style={{ marginBottom: "24px" }}>
        <div className="section-header" style={{ marginBottom: "18px" }}>
          <div>
            <h2 className="section-title">Live Sensor Readings</h2>
            <p className="section-desc">
              {connected
                ? "The IoT device is connected and the latest sensor values are available."
                : "Plug in the IoT device and connect it to view the latest soil readings."}
            </p>
          </div>
          <span className={`status-pill ${connected ? "status-sufficient" : "status-deficient"}`}>
            <span className="status-dot"></span>
            {connected ? "Device Connected" : "Waiting for Device"}
          </span>
        </div>
        {connected && (
          <div className="sensor-grid">
            {readings.map(({ name, value, unit, icon: Icon }) => (
              <div className="subpage-card" key={name}>
                <div className="meta-value-row">
                  <Icon size={18} className="text-dark-green" />
                  <strong className="meta-value">{name}</strong>
                </div>
                <div style={{ marginTop: "12px", fontSize: "28px", fontWeight: "800", color: "var(--green-dark-800)" }}>
                  {value} <span style={{ fontSize: "14px", fontWeight: "600" }}>{unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
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