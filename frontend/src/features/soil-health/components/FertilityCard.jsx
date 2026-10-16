import { Sprout, CheckCircle2, AlertTriangle, Sparkles, TrendingUp } from "lucide-react";

function FertilityCard({ 
  status = "Medium", 
  score = 74,
  sampleId = "KG-001"
}) {
  const statusLower = status.toLowerCase();
  
  // Calculate SVG circular stroke
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="fertility-hero-card">
      <div className="fertility-main-content">
        {/* Left: Circular Score Gauge */}
        <div className="fertility-score-box">
          <div className="circular-gauge-wrap">
            <svg className="circular-gauge-svg" width="110" height="110" viewBox="0 0 110 110">
              <circle
                className="gauge-bg"
                cx="55"
                cy="55"
                r={radius}
                strokeWidth="9"
              />
              <circle
                className="gauge-progress"
                cx="55"
                cy="55"
                r={radius}
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="gauge-score-inner">
              <span className="gauge-number">{score}</span>
              <span className="gauge-denom">/ 100</span>
            </div>
          </div>
          
          <div className="fertility-status-label-wrap">
            <span className={`fertility-pill pill-${statusLower}`}>
              <Sprout size={14} />
              {status} Fertility
            </span>
            <span className="fertility-grade-sub">Agro-Grade B+ (Viable)</span>
          </div>
        </div>

        {/* Center: AI Agronomic Assessment Verdict */}
        <div className="fertility-details">
          <div className="fertility-header-row">
            <div className="fertility-ai-badge">
              <Sparkles size={14} />
              <span>ML Agro-Assessment Verdict</span>
            </div>
            <span className="sample-tag-ref">Ref: {sampleId}</span>
          </div>

          <h3 className="fertility-heading">
            Balanced Vegetative Soil with Targeted Phosphorus Need
          </h3>

          <p className="fertility-description">
            Physical soil parameters and Nitrogen-Potassium ratios in this Kegalle sample are healthy and well-suited for perennial plantation crops. Supplementing phosphorus will optimize root development and overall nutrient bioavailability.
          </p>

          {/* Sub-metric progress bars */}
          <div className="fertility-submetrics">
            <div className="submetric-item">
              <div className="submetric-label">
                <span>NPK Balance</span>
                <strong>72%</strong>
              </div>
              <div className="submetric-bar">
                <div className="submetric-fill" style={{ width: "72%" }}></div>
              </div>
            </div>

            <div className="submetric-item">
              <div className="submetric-label">
                <span>pH Quality (6.4)</span>
                <strong>92%</strong>
              </div>
              <div className="submetric-bar">
                <div className="submetric-fill" style={{ width: "92%" }}></div>
              </div>
            </div>

            <div className="submetric-item">
              <div className="submetric-label">
                <span>Moisture Health</span>
                <strong>86%</strong>
              </div>
              <div className="submetric-bar">
                <div className="submetric-fill" style={{ width: "86%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Recommendations & Action items */}
        <div className="fertility-action-box">
          <h4 className="action-box-title">
            <TrendingUp size={15} />
            Agronomist Guidance
          </h4>

          <div className="action-item">
            <AlertTriangle size={15} className="action-item-icon warning" />
            <div>
              <strong>Phosphorus Correction</strong>
              <p>Apply Eppawala Rock Phosphate (ERP) @ 150 kg/ha.</p>
            </div>
          </div>

          <div className="action-item">
            <CheckCircle2 size={15} className="action-item-icon success" />
            <div>
              <strong>Organic Mulching</strong>
              <p>Add 2-3 tons/ha bio-compost to preserve 63% moisture.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FertilityCard;