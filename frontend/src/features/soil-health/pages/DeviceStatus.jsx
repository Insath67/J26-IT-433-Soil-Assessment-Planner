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
import { useCallback, useEffect, useState } from "react";
import { getDeviceStatus, getLatestSensorReadings } from "../services/api";

function DeviceStatus() {
  const [device, setDevice] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const connected = device?.status?.toLowerCase() === "online";

  const loadDeviceData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const deviceResponse = await getDeviceStatus();
      setDevice(deviceResponse.data);

      if (deviceResponse.data.status?.toLowerCase() !== "online") {
        setSensorData(null);
        return;
      }

      const sensorResponse = await getLatestSensorReadings();
      setSensorData(sensorResponse.data);
    } catch (requestError) {
      setDevice(null);
      setSensorData(null);
      setError(requestError.response?.data?.detail || "The device could not be reached.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadDeviceData();
    }, 0);

    return () => window.clearTimeout(initialLoad);
  }, [loadDeviceData]);

  const readings = sensorData
    ? [
        { name: "Soil pH", value: sensorData.ph, unit: "", icon: FlaskConical },
        { name: "Nitrogen (N)", value: sensorData.nitrogen, unit: "mg/kg", icon: FlaskConical },
        { name: "Phosphorus (P)", value: sensorData.phosphorus, unit: "mg/kg", icon: FlaskConical },
        { name: "Potassium (K)", value: sensorData.potassium, unit: "mg/kg", icon: FlaskConical },
        { name: "Moisture", value: sensorData.moisture, unit: "%", icon: Droplets },
        { name: "Temperature", value: sensorData.temperature, unit: "°C", icon: Thermometer },
        { name: "Electrical Conductivity", value: sensorData.ec, unit: "mS/cm", icon: Zap },
      ]
    : [];
  const sensors = device?.sensors || [];

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

        <button className="primary-btn" onClick={loadDeviceData} disabled={loading}>
          {connected ? <RefreshCw size={15} /> : <PlugZap size={15} />}
          <span>{loading ? "Checking Device..." : "Refresh Readings"}</span>
        </button>
      </div>

      <div className="sample-card-glass" style={{ marginBottom: "24px" }}>
        <div className="section-header" style={{ marginBottom: "18px" }}>
          <div>
            <h2 className="section-title">Live Sensor Readings</h2>
            <p className="section-desc">
              {connected
                ? "The IoT device is connected and the latest sensor values are available."
                : "The IoT device is disconnected. Connect the ESP32 device to view soil readings."}
            </p>
          </div>
          <span className={`status-pill ${connected ? "status-sufficient" : "status-deficient"}`}>
            <span className="status-dot"></span>
            {loading ? "Checking Device" : connected ? "Device Connected" : "Device Offline"}
          </span>
        </div>
        {error && (
          <p role="alert" style={{ color: "#b91c1c", marginBottom: "18px" }}>
            {error}
          </p>
        )}
        {connected && !loading && (
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
              <strong className="meta-value">{device?.microcontroller || "ESP32-WROOM-32"}</strong>
            </div>
            <span className="meta-sub">Dual Core 240MHz</span>
          </div>

          <div className="sample-meta-cell">
            <span className="meta-label">Wireless Connectivity</span>
            <div className="meta-value-row">
              <Wifi size={16} className="text-light-green" />
              <strong className="meta-value">{connected ? "WiFi 2.4GHz / LoRa" : "Disconnected"}</strong>
            </div>
              <span className="meta-sub">{connected ? `Signal: ${device?.wifiSignal || "Unavailable"}` : "Signal unavailable"}</span>
          </div>

          <div className="sample-meta-cell">
            <span className="meta-label">Power & Solar Battery</span>
            <div className="meta-value-row">
              <Battery size={16} className="text-dark-green" />
              <strong className="meta-value">{connected ? `3.7V Li-Ion • ${device?.batteryLevel ?? "--"}%` : "Unavailable"}</strong>
            </div>
            <span className="meta-sub">{connected ? "Solar Charging Active" : "Device offline"}</span>
          </div>

          <div className="sample-meta-cell">
            <span className="meta-label">Uptime & Heartbeat</span>
            <div className="meta-value-row">
              <Clock size={16} className="text-dark-green" />
              <strong className="meta-value">{connected ? "14 Days, 6 Hours" : "Unavailable"}</strong>
            </div>
            <span className="meta-sub">{connected ? `Last ping: ${device?.lastPing || "Active"}` : "No heartbeat received"}</span>
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
                  <span className={`status-pill ${connected ? "status-sufficient" : "status-deficient"}`}>
                    <CheckCircle2 size={13} />
                    {connected ? sensor.status : "Offline"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "160px" }}>
                    <div style={{ flex: 1, height: "6px", background: "var(--border-subtle)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: connected ? sensor.health : "0%", height: "100%", background: "var(--green-light-500)", borderRadius: "999px" }}></div>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: "700" }}>{connected ? sensor.health : "0%"}</span>
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