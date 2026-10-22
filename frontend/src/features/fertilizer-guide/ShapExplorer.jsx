import { useState } from 'react'

// Turn backend feature names into readable labels.
const LABELS = { crop: 'Crop', soil_type: 'Soil type', N: 'Nitrogen', P: 'Phosphorus', K: 'Potassium', pH: 'Soil pH', moisture: 'Moisture', temperature: 'Temperature', EC: 'Conductivity (assumed baseline)' }
// Show reference links only when the explanation includes sources.
function Sources({ items }) {
  return items?.length ? <p className="fg-explanation-sources">References: {items.map(item => <a key={item.url} href={item.url} target="_blank" rel="noreferrer">{item.title}</a>)}</p> : null
}

// Display a simple explanation first, with optional technical SHAP details.
export default function ShapExplorer({ explanations, onEdit }) {
  // Switch between organic/inorganic results and show or hide model details.
  const [category, setCategory] = useState('inorganic')
  const [detailed, setDetailed] = useState(false)
  // Older saved results may not contain explanation data.
  if (!explanations) return <section className="fg-detail-panel fg-explorer"><h2>Your recommendation explained</h2><p>This saved result predates explanations. Create a new recommendation to calculate its SHAP contributions.</p><button className="fg-primary" onClick={onEdit}>Enter soil information</button></section>
  const explanation = explanations[category]
  const { model, assessment, composition } = explanation
  // Scale chart bars by the largest absolute contribution for this result.
  const max = Math.max(...model.features.map(item => Math.abs(item.contribution)), 0.001)
  return <section className="fg-detail-panel fg-explorer">
    <div className="fg-explorer-heading"><div><div className="fg-eyebrow">UNDERSTAND YOUR RECOMMENDATION</div><h2>Your recommendation explained</h2></div><button className="fg-secondary" onClick={onEdit}>Enter soil information</button></div>
    <div className="fg-explorer-controls" role="group" aria-label="Explanation options">
      {['organic', 'inorganic'].map(type => <button key={type} className={category === type ? 'fg-primary' : 'fg-secondary'} aria-pressed={category === type} onClick={() => setCategory(type)}>{type === 'organic' ? 'Organic' : 'Inorganic'}</button>)}
      <button className="fg-secondary" aria-pressed={detailed} onClick={() => setDetailed(!detailed)}>{detailed ? 'Show simple explanation' : 'Show detailed explanation'}</button>
    </div>
    {/* Show entered measurements, comparison targets and practical next steps. */}
    <h3>{explanation.title}</h3>
    <p>{composition.summary}</p>
    {explanation.input_summary && <p>{explanation.input_summary}</p>}
    <p>{assessment.reference_note}</p>
    <div className="fg-table-scroll"><table><thead><tr><th>Nutrient</th><th>Your input</th><th>Crop target minimum</th><th>Comparison</th></tr></thead><tbody>{assessment.nutrients.map(item => <tr key={item.nutrient}><td>{LABELS[item.nutrient]}</td><td>{item.value} {assessment.reference ? item.unit : '(entered units)'}</td><td>{item.minimum ?? 'Add a crop target'}</td><td>{item.minimum == null ? 'Target needed for adjustment' : item.status}</td></tr>)}</tbody></table></div>
    <h3>What should you do?</h3>
    <ul>{explanation.next_steps.map(step => <li key={step}>{step}</li>)}</ul>
    <h3>Observe soil conditions over time</h3>
    <p>{explanation.monitoring_plan || 'Live IoT integration is pending. This saved result uses the measurements submitted with it.'}</p>
    <h3>Soil pH: {assessment.pH.value}</h3>
    <p>{assessment.pH.explanation}</p>
    <Sources items={assessment.pH.sources} />
    <div className="fg-explorer-details">
      <h3>Ingredients and mixing ratio</h3>
      {composition.ingredients.length > 0 && <div className="fg-table-scroll"><table><thead><tr><th>Ingredient</th><th>Reference composition</th><th>Purpose</th></tr></thead><tbody>{composition.ingredients.map(item => <tr key={item.name}><td>{item.name}</td><td>{item.share}</td><td>{item.role}</td></tr>)}</tbody></table></div>}
      <p>{composition.ratio_note}</p><Sources items={composition.sources} />
      {/* Keep probability calculations and SHAP contributions in the detailed view. */}
      {detailed && <>
      <h3>Your measurements and supplied thresholds</h3>
      <div className="fg-table-scroll"><table><thead><tr><th>Nutrient</th><th>Your value</th><th>Lower threshold</th><th>Interpretation</th></tr></thead><tbody>{assessment.nutrients.map(item => <tr key={item.nutrient}><td>{item.nutrient}</td><td>{item.value} {item.unit}</td><td>{item.minimum ?? 'Not supplied'}</td><td>{item.status}</td></tr>)}</tbody></table></div>
      {assessment.nutrients.filter(item => item.status !== 'below supplied threshold').map(item => <p key={item.nutrient}><strong>{item.nutrient}:</strong> {item.explanation}</p>)}
      {assessment.reference && <p>Reference: {assessment.reference.source}. Test method: {assessment.reference.method}. Crop / stage: {assessment.reference.crop} / {assessment.reference.growth_stage}.</p>}
      <h3>How the model chose this output</h3>
      <p>{model.summary}</p>
      <p>{model.note}</p>
      {model.status === 'available' && <>
        <p>Baseline probability: {(model.base_probability * 100).toFixed(1)}%. Probability for this output: {(model.predicted_probability * 100).toFixed(1)}%.</p>
        <p>Positive contributions support this output; negative contributions oppose it. These are probability-point changes relative to the model baseline.</p>
        <div className="fg-shap-chart" aria-label="SHAP contributions for the selected fertilizer">
          {model.features.map(item => <div className="fg-shap-row" key={item.feature}>
            <span>{LABELS[item.feature]}: {String(item.value)}</span>
            <div className="fg-shap-track"><span className={item.direction} style={{ width: `${Math.abs(item.contribution) / max * 100}%` }} /></div>
            <strong>{item.contribution > 0 ? '+' : ''}{(item.contribution * 100).toFixed(2)} pp</strong>
          </div>)}
        </div>
        <p>Baseline + all contributions = predicted probability. SHAP is model behaviour, not a causal explanation of plant health.</p>
      </>}
      </>}
    </div>
  </section>
}
