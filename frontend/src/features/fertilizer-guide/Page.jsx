//import ModuleStarter from '@/shared/ModuleStarter'
//export default function Page() { return <ModuleStarter slug="fertilizer-guide" /> }

import { useState } from 'react'
import { Leaf, FlaskConical, CalendarDays, AlertCircle, Sprout, LoaderCircle } from 'lucide-react'
import './Page.css'

const STAGES = {
  Tea: ['Nursery', 'Immature', 'Formative / post-pruning', 'Mature production'],
  Rubber: ['Planting', 'Immature', 'Mature tapping'],
  Pepper: ['Establishment', 'Early maturity', 'Bearing'],
  Vanilla: ['Establishment', 'Vegetative', 'Pre-flowering', 'Pod development'],
}
const SOILS = {
  Tea: 'Red-Yellow Podzolic (Ultisol)',
  Rubber: 'Red-Yellow Podzolic (Ultisol)',
  Pepper: 'Red-Yellow Podzolic (Ultisol)',
  Vanilla: 'Loamy soil',
}
const DEFAULT = { crop: 'Tea', soil_type: SOILS.Tea, N: '50', P: '20', K: '100', pH: '5', moisture: '58.7', temperature: '19.9', EC: '1.99', growth_stage: 'Mature production', plant_age_years: '', soil_series: '', bark_type: '', fertilizer_for_lookup: '' }
const NUMBERS = [
  ['N','Nitrogen (N)'], ['P','Phosphorus (P)'], ['K','Potassium (K)'],
  ['pH','Soil pH'], ['moisture','Moisture (%)'], ['temperature','Temperature (°C)'], ['EC','Electrical conductivity (EC)']
]
const API = `${import.meta.env.VITE_API_BASE_URL || '/api'}/fertilizer-guide`

function Rule({ rule }) {
  return <article className="fg-rule">
    <div className="fg-rule-top"><strong>{rule.fertilizer}</strong><span className="fg-status">{rule.verification_status}</span></div>
    <div className="fg-rule-grid">
      <div><small>Annual quantity</small><b>{rule.annual_quantity ?? 'Not established'} {rule.annual_quantity != null ? rule.quantity_unit : ''}</b></div>
      <div><small>Per application</small><b>{rule.quantity_per_application ?? 'Not established'} {rule.quantity_per_application != null ? rule.application_unit : ''}</b></div>
      <div><small>Frequency</small><b>{rule.applications_per_year ?? 'Not established'} applications/year</b></div>
    </div>
    <p><strong>When:</strong> {rule.timing || 'Not established'}</p>
    <p><strong>How:</strong> {rule.application_method || 'Not established'}</p>
    {rule.conditions_and_cautions && <p className="fg-caution"><strong>Caution:</strong> {rule.conditions_and_cautions}</p>}
    <small className="fg-source">Source: {rule.source}</small>
  </article>
}

export default function Page() {
  const [form, setForm] = useState(DEFAULT)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const newAnalysis = () => { setShowForm(true); setResult(null); setError('') }
  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }))
  const changeCrop = (crop) => { setForm(previous => ({ ...previous, crop, soil_type: SOILS[crop], growth_stage: STAGES[crop][0], plant_age_years: '', soil_series: crop === 'Rubber' ? 'Parambe' : '', bark_type: '', fertilizer_for_lookup: '' })); setResult(null) }

  async function submit(event) {
    event.preventDefault(); setLoading(true); setError(''); setResult(null)
    const payload = { ...form }
    for (const [key] of NUMBERS) payload[key] = Number(form[key])
    payload.plant_age_years = form.plant_age_years === '' ? null : Number(form.plant_age_years)
    for (const key of ['soil_series','bark_type','fertilizer_for_lookup']) payload[key] = form[key] || null
    try {
      const response = await fetch(`${API}/recommend`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await response.json()
      if (!response.ok) throw new Error(json.message || json.detail?.[0]?.msg || 'Prediction failed. Check the backend terminal.')
      setResult(json); setShowForm(false)
    } catch (e) { setError(e.message || 'Could not connect to the API. Start FastAPI on port 8000.') }
    finally { setLoading(false) }
  }

  return <main id="content" className="fg-workspace">
    <aside className="fg-sidebar"><div className="fg-brand"><Leaf/> <strong>Verdant</strong><small>SMART AGRICULTURE</small></div><p className="fg-side-label">RESEARCH WORKSPACE</p><button className={!showForm ? 'fg-side-active' : ''} onClick={() => setShowForm(false)}>▦ &nbsp; Fertilizer recommendations</button><button onClick={newAnalysis}>＋ &nbsp; New analysis</button><div className="fg-side-note"><Leaf/><h3>Better insights.<br/>Informed planting.</h3><p>Explore fertilizer options using soil measurements and crop growth stages.</p></div></aside>
    <div className="fg-workspace-main"><div className="fg-crumb">Workspace &nbsp; / &nbsp; Fertilizer planning <span>● &nbsp; Engine connected</span></div><div className="fg-page">
    <div className="fg-dashboard-title"><div className="fg-heading"><div className="fg-eyebrow">GROW WITH INSIGHT</div><h1>Fertilizer recommendations<span style={{color:'#f3a21a'}}>.</span></h1><p>Understand your soil. Explore organic and inorganic fertilizer options.</p></div><button className="fg-new-btn" onClick={newAnalysis}>＋ &nbsp; New analysis</button></div>
    <div className="fg-location">⌖ &nbsp; Kegalle District &nbsp; <span>Sri Lanka</span><em>SYNTHETIC DATA · RESEARCH DEMO</em></div>
    <div className="fg-metrics">{[['Soil pH',form.pH],['Temperature',form.temperature+' °C'],['Moisture',form.moisture+' %'],['Electrical conductivity',form.EC]].map(([label,value])=><div className="fg-metric" key={label}><small>{label.toUpperCase()}</small><strong>{result ? value : '—'}</strong><span>{result ? 'Latest analysis' : 'Awaiting analysis'}</span></div>)}</div>
    <div className="fg-shortlist"><h2>Your fertilizer recommendations</h2><p>{result ? 'Recommendations from your latest analysis.' : 'Run an analysis to explore fertilizers for your soil and crop.'}</p></div>
    <div className={showForm ? 'fg-layout fg-form-open' : 'fg-layout fg-form-closed'}>
    <div className="fg-heading"><div className="fg-eyebrow"><Sprout size={15}/> SOIL INTELLIGENCE · KEGALLE</div><h1>Fertilizer Guide</h1><p>Enter soil measurements and plant stage to explore organic and inorganic fertilizer recommendations, with available application guidance.</p></div>
    <div className="fg-layout">
      {showForm && <form className="fg-panel fg-form" onSubmit={submit}>
        <div className="fg-section-heading"><span>01</span><h2>Plant details</h2></div>
        <div className="fg-two">
          <label>Crop<select value={form.crop} onChange={e => changeCrop(e.target.value)}>{Object.keys(STAGES).map(c => <option key={c}>{c}</option>)}</select></label>
          <label>Growth stage<select value={form.growth_stage} onChange={e => update('growth_stage', e.target.value)}>{STAGES[form.crop].map(s => <option key={s}>{s}</option>)}</select></label>
        </div>
        <label>Soil type<input required value={form.soil_type} onChange={e => update('soil_type', e.target.value)}/></label>
        <div className="fg-two">
          <label>Plant age (years)<input type="number" min="0" step="0.1" placeholder="Optional" value={form.plant_age_years} onChange={e => update('plant_age_years', e.target.value)}/></label>
          {form.crop === 'Rubber' ? <label>Soil series<select value={form.soil_series} onChange={e => update('soil_series',e.target.value)}><option value="">Unknown</option><option value="Parambe">Parambe</option></select></label> : <div/>}
        </div>
        {form.crop === 'Rubber' && form.growth_stage === 'Mature tapping' && <label>Bark type<select value={form.bark_type} onChange={e => update('bark_type', e.target.value)}><option value="">Select bark type</option><option>Virgin bark</option><option>Renewed bark</option></select></label>}
        <div className="fg-section-heading fg-section-gap"><span>02</span><h2>Soil measurements</h2></div>
        <div className="fg-number-grid">{NUMBERS.map(([key,label]) => <label key={key}>{label}<input type="number" required step="any" min={['N','P','K','EC','moisture','pH'].includes(key) ? 0 : undefined} max={key === 'pH' ? 14 : key === 'moisture' ? 100 : undefined} value={form[key]} onChange={e => update(key,e.target.value)}/></label>)}</div>
        <p className="fg-hint">NPK units are provisional until confirmed by the IoT team. Results are research prototypes, not field prescriptions.</p>
        <details className="fg-advanced"><summary>Optional: look up a specific fertilizer application rule</summary><label>Exact fertilizer name<input placeholder="e.g. R/U 15:15:7 mixture" value={form.fertilizer_for_lookup} onChange={e => update('fertilizer_for_lookup',e.target.value)}/></label><p>This does not change the ML prediction. It only looks up a matching application rule.</p></details>
        <button className="fg-submit" disabled={loading} type="submit">{loading ? <LoaderCircle size={18} className="fg-spin"/> : <Leaf size={18}/>} {loading ? 'Analyzing soil…' : 'Get fertilizer recommendation'}</button>
        {error && <div role="alert" className="fg-error"><AlertCircle size={17}/>{error}</div>}
      </form>}
      <section className="fg-results" aria-live="polite">
        {!result ? <div className="fg-empty"><div className="fg-empty-icon"><Leaf size={32}/></div><h2>Your recommendations appear here</h2><p>Click New analysis to enter your soil measurements and select the plant stage.</p></div> : <>
          <div className="fg-results-heading"><h2>Recommended fertilizers</h2><span>{result.inputs.crop} · {result.inputs.growth_stage}</span></div>
          <div className="fg-predictions">{[['organic','Organic option',Leaf],['inorganic','Inorganic option',FlaskConical]].map(([key,label,Icon]) => <div className="fg-prediction" key={key}><div className="fg-prediction-title"><Icon size={20}/>{label}</div><h3>{result.ml_predictions[key]?.fertilizer || 'Not available'}</h3><small>Model confidence: {result.ml_predictions[key]?.model_probability != null ? `${(result.ml_predictions[key].model_probability*100).toFixed(1)}%` : 'Not available'}</small></div>)}</div>
          <div className="fg-application-title"><CalendarDays size={20}/><h2>Quantity, schedule & method</h2></div>
          {result.application_rules.length ? result.application_rules.map(r => <Rule key={r.rule_id} rule={r}/>) : <div className="fg-no-match">No exact fertilizer-specific application rule matched the model predictions. Quantity and schedule have not been assigned.</div>}
          {result.unmatched_recommendations.map(item => <div className="fg-unmatched" key={item.category}><strong>{item.category === 'organic' ? 'Organic' : 'Inorganic'} application rule unavailable</strong><p>{item.message}</p>{item.available_rules.length > 0 && <details><summary>See {item.available_rules.length} other stage-matched reference options</summary><ul>{item.available_rules.map(r => <li key={r.rule_id}>{r.fertilizer} — {r.verification_status}</li>)}</ul></details>}</div>)}
          {result.additional_amendment_reference?.length > 0 && <details className="fg-amendments"><summary>Additional soil amendment references (not automatically recommended)</summary>{result.additional_amendment_reference.map(r => <Rule key={r.rule_id} rule={r}/>)}</details>}
          <div className="fg-warnings"><strong><AlertCircle size={17}/> Research limitations</strong><ul>{result.warnings.map((w,i)=><li key={i}>{w}</li>)}</ul></div>
        </>}
      </section>
    </div></div></div></div>
  </main>
}
