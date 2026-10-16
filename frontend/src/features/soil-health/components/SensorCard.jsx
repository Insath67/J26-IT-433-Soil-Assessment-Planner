function SensorCard({
  name,
  value,
  unit,
  status,
  icon,
  chemicalSymbol,
  targetRange,
  progressPercent = 65,
  statusType
}) {
  // Normalize status styling class
  const normalizedStatus = (statusType || status || "").toLowerCase();
  const isDeficient = normalizedStatus.includes("deficient") || normalizedStatus.includes("low");
  const isHigh = normalizedStatus.includes("high") || normalizedStatus.includes("excess");

  const badgeClass = isDeficient 
    ? "status-badge-deficient" 
    : isHigh 
    ? "status-badge-high" 
    : "status-badge-optimal";

  return (
    <div className="sensor-card">
      <div className="sensor-card-top">
        <div className="sensor-title-group">
          {chemicalSymbol && <span className="chemical-symbol">{chemicalSymbol}</span>}
          <h4 className="sensor-name">{name}</h4>
        </div>

        {icon && (
          <div className="sensor-icon-wrapper">
            {icon}
          </div>
        )}
      </div>

      <div className="sensor-value-row">
        <div className="sensor-value-wrap">
          <span className="sensor-value">{value}</span>
          {unit && <span className="sensor-unit">{unit}</span>}
        </div>

        {status && (
          <span className={`sensor-status-badge ${badgeClass}`}>
            <span className="status-dot"></span>
            {status}
          </span>
        )}
      </div>

      {/* Visual Agronomic Range Gauge Bar */}
      <div className="sensor-bar-section">
        <div className="sensor-bar-track">
          <div 
            className={`sensor-bar-fill ${isDeficient ? "bar-deficient" : "bar-optimal"}`}
            style={{ width: `${Math.min(Math.max(progressPercent, 12), 100)}%` }}
          ></div>
        </div>
        {targetRange && (
          <div className="sensor-range-caption">
            <span>Ideal Range:</span>
            <strong>{targetRange}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default SensorCard;