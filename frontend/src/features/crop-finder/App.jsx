import { useEffect, useRef, useState } from 'react'
import './App.css'

const API = `${import.meta.env.VITE_API_BASE_URL || '/api'}/crop-finder`
const CROPS = ['Tea', 'Pepper', 'Cocoa', 'Vanilla', 'Rubber']
const BOTANICAL = { Tea: 'Camellia sinensis', Pepper: 'Piper nigrum', Cocoa: 'Theobroma cacao', Vanilla: 'Vanilla planifolia', Rubber: 'Hevea brasiliensis' }
const LABELS = { N: 'Nitrogen (N)', P: 'Phosphorus (P)', K: 'Potassium (K)', ph: 'Soil pH', temperature: 'Temperature (°C)', humidity: 'Humidity (%)', rainfall: 'Annual rainfall (mm)' }
const EMPTY = { N: '', P: '', K: '', ph: '', temperature: '', humidity: '', rainfall: '' }
const BOUNDS = { N: [0, 10000], P: [0, 10000], K: [0, 10000], ph: [0, 14], temperature: [-30, 60], humidity: [0, 100], rainfall: [0, 15000] }

function Icon({ name, size = 20 }) {
  const paths = {
    leaf: <><path d="M20 4c-8-1-15 2-15 9a6 6 0 0 0 6 6c7 0 10-7 9-15Z"/><path d="m4 21 11-11"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/></>,
    drop: <path d="M12 3s-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12Z"/>,
    soil: <><path d="m3 8 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 5 9-5"/></>,
    spark: <><path d="m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7L12 3Z"/><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5L20 2Z"/></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
    close: <path d="m6 6 12 12M6 18 18 6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.leaf}</svg>
}

async function requestApi(path, options = {}) {
  let response
  try { response = await fetch(`${API}${path}`, { ...options, signal: AbortSignal.timeout(20000) }) }
  catch { throw new Error('Cannot reach the Python server. Start the FastAPI backend on port 8000 and try again.') }
  let data
  try { data = await response.json() } catch { throw new Error('The server returned an unexpected response. Check the API connection.') }
  if (!response.ok || data.status === 'error') throw new Error(data.message || 'The request could not be completed.')
  return data
}

function App() {
  const [meta, setMeta] = useState(null)
  const [connection, setConnection] = useState('checking')
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [mode, setMode] = useState('manual')
  const [open, setOpen] = useState(false)
  const [help, setHelp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sample, setSample] = useState('Tea')
  const dialog = useRef(null)
  const firstInput = useRef(null)
  const trigger = useRef(null)

  async function connect() {
    setConnection('checking')
    try { const metadata = await requestApi('/metadata'); setMeta(metadata); setConnection('online') }
    catch { setConnection('offline') }
  }
  useEffect(() => { let active = true
    requestApi('/metadata').then(data => { if (active) { setMeta(data); setConnection('online') } }).catch(() => { if (active) setConnection('offline') })
    return () => { active = false }
  }, [])
  useEffect(() => {
    if (open) { dialog.current?.showModal(); firstInput.current?.focus() }
    else { dialog.current?.close(); trigger.current?.focus() }
  }, [open])

  const predictions = result?.recommendations || []
  const active = predictions.find(c => c.crop === selected) || predictions[0]
  const values = result?.inputs
  const ordered = predictions.length ? predictions : CROPS.map(crop => ({ crop }))
  const top = predictions[0]?.crop
  const maxImpact = active ? Math.max(...active.factors.map(f => Math.abs(f.shap_value)), 0.001) : 1

  function startAnalysis() { setError(''); setOpen(true) }
  function fillSample() {
    const values = meta?.samples[sample]
    if (values) { setForm(Object.fromEntries(Object.entries(values).map(([key, val]) => [key, String(Number(val.toFixed(2)))]))); setMode('manual'); setError('') }
  }
  async function analyze(event) {
    event.preventDefault(); setError(''); setLoading(true)
    const body = { weather_mode: mode }
    const fields = mode === 'live' ? ['N', 'P', 'K', 'ph', 'rainfall'] : Object.keys(EMPTY)
    for (const field of fields) body[field] = Number(form[field])
    try {
      const data = await requestApi('/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setResult(data); setSelected(data.recommended_crop); setConnection('online'); setOpen(false)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  function exportResult() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `crop-analysis-${result.analysis_id.slice(0, 8)}.json`; anchor.click(); URL.revokeObjectURL(url)
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#main"><span className="brand-symbol"><Icon name="leaf" size={25}/></span><span>Verdant<span className="brand-sub">SMART AGRICULTURE</span></span></a>
      <div className="workspace-label">RESEARCH WORKSPACE</div>
      <nav aria-label="Main navigation">
        <a href="#main" className="nav-item current"><Icon name="grid"/>Crop recommendations<Icon name="arrow" size={15}/></a>
        <button className="nav-item" onClick={startAnalysis}><Icon name="plus"/>New analysis</button>
        <button className={`nav-item ${help ? 'help-active' : ''}`} onClick={() => setHelp(!help)} aria-expanded={help}><Icon name="info"/>How it works</button>
      </nav>
      <div className="sidebar-note"><span className="mini-leaf"><Icon name="leaf" size={30}/></span><h3>Better insights.<br/>Informed planting.</h3><p>Explore how soil and climate shape your crop recommendations.</p><button onClick={startAnalysis}>Explore your field <Icon name="arrow" size={16}/></button></div>
      <div className="sidebar-bottom"><span className="avatar">KB</span><span>Kegalle research<span className="subtle">Crop recommendation module</span></span></div>
    </aside>
    <div className="page-wrap">
      <header className="topbar"><span>Workspace <span className="slash">/</span> <strong>Crop planning</strong></span><button className={`connection ${connection}`} onClick={connect} aria-label="Check API connection"><i/>{connection === 'online' ? 'Engine connected' : connection === 'checking' ? 'Connecting…' : 'Engine offline · Retry'}</button></header>
      <main id="main">
        <div className="page-heading"><div><div className="eyebrow">GROW WITH INSIGHT</div><h1>Crop recommendations<span>.</span></h1><p>Understand your soil. Explore your crops. See the reasons behind every recommendation.</p></div><button className="primary" onClick={startAnalysis} ref={trigger}><Icon name="plus" size={18}/>New analysis</button></div>
        <div className="context-row"><span><Icon name="pin" size={17}/><strong>Kegalle District</strong><span className="context-muted">Sri Lanka</span></span><span className="demo-tag">SYNTHETIC DATA · RESEARCH DEMO</span></div>
        {help && <section className="help-panel"><h2>From field inputs to a clear explanation</h2><p>Enter soil nutrients and climate values, or load a synthetic sample. XGBoost ranks five crops; SHAP explains which inputs raise or lower each crop’s model score. Live mode retrieves Kegalle temperature and humidity. Rainfall stays a separate annual input.</p><p>This prototype uses synthetic training data. Model scores are not verified probabilities of successful cultivation. Soil classification and IoT ingestion are future integrations.</p></section>}
        <section className="metrics" aria-label="Analysis inputs">
          {[['soil', 'SOIL pH', values?.ph, '', 'Acidity / alkalinity'], ['sun', 'TEMPERATURE', values?.temperature, '°C', result?.weather.source || 'Awaiting analysis'], ['drop', 'HUMIDITY', values?.humidity, '%', result?.weather.source || 'Awaiting analysis'], ['leaf', 'ANNUAL RAINFALL', values?.rainfall, 'mm', 'Manual · demo annual basis']].map(([icon, label, value, unit, caption]) => <div className="metric" key={label}><div className="metric-top"><span>{label}</span><Icon name={icon} size={18}/></div><div className="metric-value">{value == null ? '—' : Number(value.toFixed(1)).toLocaleString()}<span>{value == null ? '' : unit}</span></div><div className="metric-caption">{caption}</div></div>)}
        </section>
        <div className="section-heading"><div><h2>Your crop shortlist <span>05 CROPS</span></h2><p>{result ? 'Ranked by model score. Select a crop to explore its explanation.' : 'Run an analysis to compare crops for your soil and climate inputs.'}</p></div>{result && <button className="text-button" onClick={exportResult}><Icon name="download" size={16}/>Export results</button>}</div>
        <section className="crop-grid" aria-label="Crop recommendations">
          {ordered.map((item, i) => <button key={item.crop} disabled={!result} className={`crop-card ${i === 0 ? 'featured' : ''} ${active?.crop === item.crop ? 'selected' : ''}`} onClick={() => setSelected(item.crop)} aria-pressed={active?.crop === item.crop}>
            <div className="crop-top"><span className="crop-icon"><Icon name="leaf" size={i === 0 ? 26 : 21}/></span>{i === 0 ? <span className="match-tag">{result ? 'TOP MODEL MATCH' : 'YOUR NEXT INSIGHT'}</span> : <span className="rank">0{i + 1}</span>}</div>
            <div className="crop-main"><div><h3>{item.crop === 'Tea' ? 'Ceylon Tea' : item.crop === 'Pepper' ? 'Black Pepper' : item.crop}</h3><p>{BOTANICAL[item.crop]}</p></div><div className="crop-score">{item.score_percent == null ? '—' : item.score_percent.toFixed(1)}{item.score_percent != null && <span>%</span>}</div></div>
            {i === 0 && <p className="featured-copy">{result ? 'The highest-ranked crop for this analysis. Explore the factors behind the result below.' : 'A clearer view of what could grow here starts with your field inputs.'}</p>}
            <div className="score-meta"><span>MODEL SCORE</span><span>{result ? active?.crop === item.crop ? 'Viewing explanation' : 'Explore factors ↗' : 'Awaiting analysis'}</span></div><div className="progress-track"><span style={{ width: `${item.score_percent || 0}%` }}/></div>
          </button>)}
        </section>
        {!result && <div className="empty-action"><Icon name="spark"/><span>Your first insight is a few inputs away.</span><button onClick={startAnalysis}>Start an analysis <Icon name="arrow" size={16}/></button></div>}
        <section className="insight-panel" aria-labelledby="why-title" aria-live="polite">
          <div className="insight-header"><div className="insight-title"><span className="insight-icon"><Icon name="spark" size={23}/></span><div><div className="eyebrow">EXPLAINABLE AI · SHAP</div><h2 id="why-title">{active ? active.crop === top ? `Why ${active.crop}?` : `What shapes ${active.crop}’s score?` : 'Understand the “why”'}</h2></div></div><span className="explain-pill">{active ? 'Feature-level explanation' : 'Ready when you are'}</span></div>
          {active ? <div className="insight-content"><div className="explanation"><p className="explanation-lead">{active.explanation}</p><div className="legend"><span><i className="positive-dot"/>Supports this crop</span><span><i className="negative-dot"/>Lowers its score</span></div><p className="explanation-note">Bars explain this model’s decision, not crop growth or causation. Values are SHAP contributions in raw model-score units, not percentages.</p></div><div className="factors">{active.factors.map(f => <div className="factor" key={f.feature}><div className="factor-label"><span>{f.label} <small>{Number(f.value.toFixed(2))}</small></span><strong className={f.shap_value < 0 ? 'negative' : 'positive'}>{f.shap_value > 0 ? '+' : ''}{f.shap_value.toFixed(3)}</strong></div><div className="factor-axis"><span className={`factor-bar ${f.shap_value < 0 ? 'negative-bar' : ''}`} style={{ width: `${Math.abs(f.shap_value) / maxImpact * 50}%`, left: f.shap_value < 0 ? `${50 - Math.abs(f.shap_value) / maxImpact * 50}%` : '50%' }}/></div></div>)}</div></div> : <div className="insight-empty"><p>See how nutrients, soil pH and climate influence each crop’s score.</p><span>Your explanation will appear here after an analysis.</span></div>}
        </section>
        {result && <><div className="nutrient-summary"><strong>Soil inputs used</strong><span>N {values.N}</span><span>P {values.P}</span><span>K {values.K}</span><small>Nutrient units are unspecified in the supplied dataset.</small></div>{result.warnings.length > 0 && <div className="warnings" role="status"><strong>Outside the training data range</strong>{result.warnings.map(w => <p key={w}>{w}</p>)}</div>}</>}
        <footer><span><Icon name="leaf" size={15}/>Kegalle crop research <span className="footer-divider">/</span> 60% prototype</span><span>{result ? `Analyzed ${new Date(result.created_at).toLocaleString()}` : 'Soil + climate + explainability'}</span></footer>
      </main>
    </div>
    <dialog ref={dialog} onCancel={event => { event.preventDefault(); if (!loading) setOpen(false) }} className="analysis-dialog" aria-labelledby="analysis-title">
      <form onSubmit={analyze}>
        <div className="dialog-heading"><div><div className="eyebrow">FIELD INPUTS</div><h2 id="analysis-title">Start a new analysis</h2></div><button type="button" className="icon-button" onClick={() => setOpen(false)} disabled={loading} aria-label="Close analysis"><Icon name="close"/></button></div>
        <p className="dialog-intro">Enter your field values or explore with a synthetic sample.</p>
        <div className="sample-row"><label htmlFor="sample">Demo sample</label><select id="sample" value={sample} onChange={e => setSample(e.target.value)} disabled={loading}>{CROPS.map(c => <option key={c}>{c}</option>)}</select><button type="button" onClick={fillSample} disabled={!meta || loading}>Load sample</button></div>
        <fieldset disabled={loading}><legend>01 <span>Soil measurements</span></legend><div className="form-grid">{['N', 'P', 'K', 'ph'].map((f, i) => <label key={f} htmlFor={f}>{LABELS[f]}<input ref={i === 0 ? firstInput : null} id={f} type="number" step="any" min={BOUNDS[f][0]} max={BOUNDS[f][1]} value={form[f]} required onChange={e => setForm({ ...form, [f]: e.target.value })} placeholder={f === 'ph' ? 'e.g. 5.2' : 'Enter value'}/></label>)}</div><p className="field-note">Use the same nutrient scale as your dataset; its N/P/K units have not been documented.</p></fieldset>
        <fieldset disabled={loading}><legend>02 <span>Climate inputs</span></legend><div className="mode-toggle"><label><input type="radio" name="weather" checked={mode === 'manual'} onChange={() => setMode('manual')}/>Manual weather</label><label><input type="radio" name="weather" checked={mode === 'live'} onChange={() => setMode('live')}/>Live Kegalle weather</label></div>{mode === 'live' ? <p className="live-note"><Icon name="sun" size={17}/>Temperature and humidity will come from OpenWeatherMap. An API key must be configured on the Python server.</p> : <div className="form-grid">{['temperature', 'humidity'].map(f => <label key={f} htmlFor={f}>{LABELS[f]}<input id={f} type="number" step="any" min={BOUNDS[f][0]} max={BOUNDS[f][1]} value={form[f]} required onChange={e => setForm({ ...form, [f]: e.target.value })}/></label>)}</div>}<label className="rainfall-label" htmlFor="rainfall">{LABELS.rainfall}<input id="rainfall" type="number" step="any" min="0" max="15000" required value={form.rainfall} onChange={e => setForm({ ...form, rainfall: e.target.value })} placeholder="e.g. 2400"/></label><p className="field-note">Annual basis is a demo assumption for the supplied 1,500–3,000 rainfall range. Confirm with the dataset author. Hourly rain is never substituted.</p></fieldset>
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="dialog-actions"><button type="button" className="secondary" onClick={() => setOpen(false)} disabled={loading}>Cancel</button><button type="submit" className="primary" disabled={loading}>{loading ? <><span className="spinner"/>Analyzing…</> : <><Icon name="spark" size={17}/>Get recommendation</>}</button></div>
      </form>
    </dialog>
  </div>
}

export default App
