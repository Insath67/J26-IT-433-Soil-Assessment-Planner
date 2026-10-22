import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import HistoryPage from './HistoryPage'
import ShapExplorer from './ShapExplorer'
import { saveHistory } from './localHistory'
import SoilConditioning from './SoilConditioning'
import {
  Leaf, LayoutGrid, Plus, ArrowRight, MapPin, Sun,
  Droplets, FlaskConical, CalendarDays,
  AlertCircle, Sprout, LoaderCircle, X, Info, Sparkles, History
} from 'lucide-react'
import './Page.css'
import fertilizerImages from './fertilizerImages.json'

const API = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '') + '/fertilizer-guide'

const STAGES = {
  Tea: ['Nursery', 'Immature', 'Formative / post-pruning', 'Mature production'],
  Rubber: ['Planting', 'Immature', 'Mature tapping'],
  Pepper: ['Establishment', 'Early maturity', 'Bearing'],
  Vanilla: ['Establishment', 'Vegetative', 'Pre-flowering', 'Pod development'],
  Cocoa: ['Establishment', 'Early growth', 'Mature / pod production'],
}

const SOILS = {
  Tea: 'Red-Yellow Podzolic (Ultisol)',
  Rubber: 'Red-Yellow Podzolic (Ultisol)',
  Pepper: 'Red-Yellow Podzolic (Ultisol)',
  Vanilla: 'Loamy soil',
  Cocoa: 'Loamy soil',
}

const SOIL_TYPES = [...new Set(Object.values(SOILS))]

const DEFAULT = {
  crop: 'Tea',
  soil_type: SOILS.Tea,
  growth_stage: 'Mature production',
  N: '50',
  P: '20',
  K: '100',
  pH: '5',
  moisture: '58.7',
  temperature: '19.9',
  plant_age_years: '',
  soil_series: '',
  bark_type: '',
  fertilizer_for_lookup: '',
}

const NUMBERS = [
  ['N', 'Nitrogen (N)'],
  ['P', 'Phosphorus (P)'],
  ['K', 'Potassium (K)'],
  ['pH', 'Soil pH'],
  ['moisture', 'Moisture (%)'],
  ['temperature', 'Temperature (°C)'],
]

function FertilizerImage({ name, type }) {
  const [failed, setFailed] = useState(false)
  const src = fertilizerImages[type]?.[name]
  if (!src || failed) return null

  return (
    <figure className="fg-fertilizer-figure">
    <img
      className="fg-fertilizer-image"
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
    <figcaption>Illustrative image; product formulation may differ.</figcaption>
    </figure>
  )
}

function Rule({ rule }) {
  return (
    <article className="fg-rule">
      <div className="fg-rule-top">
        <strong>{rule.fertilizer}</strong>
        <span className="fg-status">
          {rule.verification_status}
        </span>
      </div>

      <div className="fg-rule-grid">
        <div>
          <small>Annual quantity</small>
          <b>
            {rule.annual_quantity ?? 'Not established'}{' '}
            {rule.annual_quantity != null ? rule.quantity_unit : ''}
          </b>
        </div>
        <div>
          <small>Per application</small>
          <b>
            {rule.quantity_per_application ?? 'Not established'}{' '}
            {rule.quantity_per_application != null ? rule.application_unit : ''}
          </b>
        </div>
        <div>
          <small>Frequency</small>
          <b>
            {rule.applications_per_year ?? 'Not established'}
            {rule.applications_per_year != null ? ' applications/year' : ''}
          </b>
        </div>
      </div>

      <p><strong>When:</strong> {rule.timing || 'Not established'}</p>
      <p><strong>How:</strong> {rule.application_method || 'Not established'}</p>

      {rule.conditions_and_cautions && (
        <p className="fg-caution">
          <strong>Caution:</strong> {rule.conditions_and_cautions}
        </p>
      )}

      <small className="fg-source">
        Source: {rule.source || 'Not specified'}
      </small>
    </article>
  )
}

export default function Page() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const view = pathname.endsWith('/history') ? 'history' : pathname.endsWith('/soil-conditioning') ? 'conditioning' : 'dashboard'

  const [form, setForm] = useState(DEFAULT)
  const [lab, setLab] = useState({ enabled: false, unit: '', method: '', source: '', N_min: '', P_min: '', K_min: '', pH_min: '', pH_max: '' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [help, setHelp] = useState(false)
  const [connection, setConnection] = useState('checking')

  const dialogRef = useRef(null)
  const firstInputRef = useRef(null)

  useEffect(() => {
    if (showForm) {
      if (!dialogRef.current?.open) {
        dialogRef.current?.showModal()
      }
      firstInputRef.current?.focus()
    } else if (dialogRef.current?.open) {
      dialogRef.current.close()
    }
  }, [showForm])

  useEffect(() => {
    checkConnection()
  }, [])

  async function checkConnection() {
    setConnection('checking')
    try {
      const response = await fetch(API + "/status", { signal: AbortSignal.timeout(8000) })
      setConnection(response.ok ? 'online' : 'offline')
    } catch {
      setConnection('offline')
    }
  }

  function newAnalysis() {
    setError('')
    setShowForm(true)
  }

  function closeAnalysis() {
    if (!loading) setShowForm(false)
  }

  function update(key, value) {
    if (key === 'growth_stage') {
      setLab(previous => ({ ...previous, enabled: false, N_min: '', P_min: '', K_min: '', pH_min: '', pH_max: '' }))
    }
    setForm(previous => ({ ...previous, [key]: value }))
  }

  function changeCrop(crop) {
    setLab(previous => ({ ...previous, enabled: false, N_min: '', P_min: '', K_min: '', pH_min: '', pH_max: '' }))
    setForm(previous => ({
      ...previous,
      crop,
      soil_type: SOILS[crop],
      growth_stage: STAGES[crop][0],
      plant_age_years: '',
      soil_series: crop === 'Rubber' ? 'Parambe' : '',
      bark_type: '',
      fertilizer_for_lookup: '',
    }))
  }

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    // The trained model requires EC; retain the existing baseline internally.
    const payload = { ...form, EC: 1.99 }

    for (const [key] of NUMBERS) {
      payload[key] = Number(form[key])
    }

    if (lab.enabled) {
      if (lab.pH_min !== '' && lab.pH_max !== '' && Number(lab.pH_min) > Number(lab.pH_max)) {
        setError('The lower pH reference must not exceed the upper reference.')
        setLoading(false)
        return
      }
      payload.lab_reference = {
        unit: lab.unit.trim(), method: lab.method.trim(), source: lab.source.trim(),
        crop: form.crop, growth_stage: form.growth_stage,
        ...Object.fromEntries(['N_min', 'P_min', 'K_min', 'pH_min', 'pH_max'].map(key => [key, lab[key] === '' ? null : Number(lab[key])])),
      }
    }

    payload.plant_age_years =
      form.plant_age_years === ''
        ? null
        : Number(form.plant_age_years)

    for (const key of [
      'soil_series',
      'bark_type',
      'fertilizer_for_lookup'
    ]) {
      payload[key] = form[key] || null
    }

    try {
      const response = await fetch(API + "/recommend", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      })

      const json = await response.json().catch(() => {
        throw new Error('The API did not return JSON. Check the FastAPI server and Vite proxy.')
      })

      if (!response.ok) {
        const detail = json.detail
        const message =
          typeof detail === 'string'
            ? detail
            : Array.isArray(detail)
              ? detail.map(item => item.msg).join(', ')
              : json.message || 'Prediction failed. Check the backend terminal.'

        throw new Error(message)
      }

      try {
        setResult(saveHistory(json))
      } catch {
        setResult({ ...json, local_save_error: 'Browser history could not be saved. Check available browser storage.' })
      }
      setConnection('online')
      setShowForm(false)
      navigate('/fertilizer-guide')
    } catch (e) {
      setError(e.message || 'Could not connect to the API.')
    } finally {
      setLoading(false)
    }
  }

  const values = result?.inputs || {}
  const predictions = result?.ml_predictions || {}

  const metrics = [
    {
      label: 'Soil pH',
      value: values.pH,
      unit: '',
      caption: 'Acidity / alkalinity',
      icon: Leaf,
    },
    {
      label: 'Temperature',
      value: values.temperature,
      unit: '°C',
      caption: 'Entered soil temperature',
      icon: Sun,
    },
    {
      label: 'Moisture',
      value: values.moisture,
      unit: '%',
      caption: 'Soil moisture level',
      icon: Droplets,
    },
  ]

  return (
    <div className="fg-module">
      <div className="fg-app-shell">

        {/* SIDEBAR */}
        <aside className="fg-sidebar">
          <a className="fg-brand" href="#fg-main">
            <span className="fg-brand-symbol">
              <Leaf size={25} />
            </span>
            <span>
              <span>Saru Bima</span>
              <span className="fg-brand-sinhala" lang="si">සරු බිම</span>
              <small>SMART AGRICULTURE</small>
            </span>
          </a>

          <div className="fg-workspace-label">
            RESEARCH WORKSPACE
          </div>

          <nav className="fg-nav" aria-label="Fertilizer navigation">
            <NavLink to="/fertilizer-guide" end className={({ isActive }) => 'fg-nav-item' + (isActive ? ' fg-current' : '')}>
              <LayoutGrid size={19} />
              <span>Fertilizer recommendations</span>
              <ArrowRight size={16} className="fg-nav-arrow" />
            </NavLink>

            <NavLink to="/fertilizer-guide/soil-conditioning" className={({ isActive }) => 'fg-nav-item' + (isActive ? ' fg-current' : '')}>
              <Sprout size={19} /><span>Soil conditioning</span>
            </NavLink>
            <NavLink to="/fertilizer-guide/history" className={({ isActive }) => 'fg-nav-item' + (isActive ? ' fg-current' : '')}>
              <History size={19} /><span>History</span>
            </NavLink>

            <button
              type="button"
              className="fg-nav-item"
              onClick={() => { setHelp(!help); navigate('/fertilizer-guide') }}
              aria-expanded={help}
            >
              <Info size={19} />
              <span>How it works</span>
            </button>
          </nav>

          <div className="fg-sidebar-note">
            <Leaf size={29} />
            <h3>Better insights.<br />Informed planting.</h3>
            <p>
              Explore fertilizer options using soil measurements
              and crop growth stages.
            </p>
            <button type="button" onClick={newAnalysis}>
              Explore your soil <ArrowRight size={16} />
            </button>
          </div>

          <div className="fg-sidebar-bottom">
            <span className="fg-avatar">KB</span>
            <span>
              Kegalle Research
              <small>Fertilizer module</small>
            </span>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="fg-page-wrap">
          <header className="fg-topbar">
            <span>
              Research workspace
              <span className="fg-slash"> / </span>
              <strong>Fertilizer planning</strong>
            </span>

            <button
              type="button"
              className={"fg-connection " + connection}
              onClick={checkConnection}
            >
              <i />
              {connection === 'online'
                ? 'Engine connected'
                : connection === 'offline'
                  ? 'Engine unavailable'
                  : 'Checking engine'}
            </button>
          </header>

          <main id="fg-main" className="fg-main">
            {view === 'history' && <HistoryPage onOpen={record => { setResult(record); navigate('/fertilizer-guide') }} />}
            {view === 'conditioning' && <SoilConditioning />}
            {view === 'dashboard' && <>
            {result?.local_save_error && <div className="fg-error" role="alert">{result.local_save_error}</div>}
            {result?.saved_locally && <p className="fg-save-status" role="status">Saved to history in this browser.</p>}
            <div className="fg-page-heading">
              <div>
                <div className="fg-eyebrow">GROW WITH INSIGHT</div>
                <h1>Fertilizer recommendations<span>.</span></h1>
                <p>
                  Understand your soil. Explore organic and inorganic
                  fertilizer options for healthier crop growth.
                </p>
              </div>

              <button
                type="button"
                className="fg-primary"
                onClick={newAnalysis}
              >
                <Plus size={18} />
                New Fertilizer Recommendation
              </button>
            </div>

            <div className="fg-context-row">
              <span className="fg-location">
                <MapPin size={17} />
                <strong>Kegalle District</strong>
                <span>Sri Lanka</span>
              </span>

            </div>

            {help && (
              <section className="fg-help-panel">
                <h2>How fertilizer recommendations work</h2>
                <p>
                  Select your crop and growth stage, enter soil
                  measurements, and run the fertilizer analysis.
                  The system returns organic and inorganic fertilizer
                  predictions with available application guidance.
                </p>
                <p>
                  This is a research prototype. NPK units and
                  fertilizer application quantities require
                  verification before field use.
                </p>
              </section>
            )}

            <section className="fg-crop-context" aria-label="Selected crop">
              <h2>{values.crop ? `${values.crop} fertilizer plan` : 'Select a crop to start your fertilizer plan'}</h2>
              {values.crop && <p>{values.growth_stage} / {values.soil_type}</p>}
              <p>Manual measurements / Live IoT integration is not yet available.</p>
            </section>

            {/* METRIC CARDS */}
            <section className="fg-metrics">
              {metrics.map(metric => {
                const Icon = metric.icon
                return (
                  <div className="fg-metric" key={metric.label}>
                    <div className="fg-metric-top">
                      <span>{metric.label}</span>
                      <Icon size={18} />
                    </div>

                    <div className="fg-metric-value">
                      {metric.value == null
                        ? '—'
                        : Number(metric.value).toLocaleString('en-LK', {
                            maximumFractionDigits: 2
                          })}
                      <span>
                        {metric.value == null ? '' : metric.unit}
                      </span>
                    </div>

                    <div className="fg-metric-caption">
                      {result ? metric.caption : 'Awaiting analysis'}
                    </div>
                  </div>
                )
              })}
            </section>

            {/* RECOMMENDATIONS */}
            <div className="fg-section-heading">
              <div>
                <h2>
                  Your fertilizer recommendations
                  <span>02 TYPES</span>
                </h2>
                <p>
                  {result
                    ? 'Recommendations based on your submitted soil measurements.'
                    : 'Run an analysis to explore fertilizers for your soil and crop.'}
                </p>
              </div>
            </div>

            <section className="fg-recommendation-grid">
              {[
                {
                  key: 'organic',
                  label: 'Organic fertilizer',
                  icon: Leaf,
                },
                {
                  key: 'inorganic',
                  label: 'Inorganic fertilizer',
                  icon: FlaskConical,
                },
              ].map((item, index) => {
                const Icon = item.icon
                const prediction = predictions[item.key]

                return (
                  <article
                    className="fg-recommendation-card"
                    key={item.key}
                  >
                    <div className="fg-card-top">
                      <span className="fg-card-icon">
                        <Icon size={25} />
                      </span>
                      <span className="fg-match-tag">
                        {index === 0 ? 'ORGANIC OPTION' : 'INORGANIC OPTION'}
                      </span>
                    </div>

                    {prediction?.fertilizer && (
                      <FertilizerImage
                        key={prediction.fertilizer}
                        name={prediction.fertilizer}
                        type={item.key}
                      />
                    )}

                    <div className="fg-card-content">
                      <h3>{item.label}</h3>
                      <h4>
                        {prediction?.fertilizer ||
                          'Awaiting recommendation'}
                      </h4>
                    </div>

                    <p className="fg-card-description">
                      {index === 0
                        ? 'Explore organic fertilizers suitable for your soil and crop conditions.'
                        : 'Explore mineral fertilizer options based on soil nutrients and plant growth.'}
                    </p>

                    <div className="fg-card-score">
                      <span>MODEL SELECTION PROBABILITY</span>
                      <strong>
                        {prediction?.model_probability != null
                          ? (prediction.model_probability * 100).toFixed(1) + "%"
                          : '—'}
                      </strong>
                    </div>

                    <p className="fg-score-note">Share of model probability assigned to this option among its fertilizer categories. This is not a crop-health score or a guarantee of field performance.</p>
                    <div className="fg-progress-track">
                      <span
                        style={{
                          width: (prediction?.model_probability != null
                            ? Math.max(0, Math.min(100, prediction.model_probability * 100))
                            : 0) + "%"
                        }}
                      />
                    </div>
                  </article>
                )
              })}
            </section>

            {!result && (
              <div className="fg-empty-action">
                <Sparkles size={19} />
                <span>
                  Your personalized fertilizer insights are one analysis away.
                </span>
                <button type="button" onClick={newAnalysis}>
                  Start analysis <ArrowRight size={16} />
                </button>
              </div>
            )}

            {result && (
              <>
                <ShapExplorer explanations={result.explanations} onEdit={newAnalysis} />
                <section className="fg-detail-panel">
                  <div className="fg-detail-header">
                    <span className="fg-detail-icon">
                      <Sprout size={23} />
                    </span>
                    <div>
                      <div className="fg-eyebrow">SOIL INTELLIGENCE</div>
                      <h2>Analysis overview</h2>
                    </div>
                  </div>

                  <div className="fg-analysis-info">
                    <div><small>Crop</small><strong>{values.crop || form.crop}</strong></div>
                    <div><small>Growth stage</small><strong>{values.growth_stage || form.growth_stage}</strong></div>
                    <div><small>Soil type</small><strong>{values.soil_type || form.soil_type}</strong></div>
                    <div><small>Nitrogen</small><strong>{values.N ?? form.N}</strong></div>
                    <div><small>Phosphorus</small><strong>{values.P ?? form.P}</strong></div>
                    <div><small>Potassium</small><strong>{values.K ?? form.K}</strong></div>
                  </div>
                </section>

                <section className="fg-detail-panel">
                  <div className="fg-detail-header">
                    <span className="fg-detail-icon">
                      <CalendarDays size={23} />
                    </span>
                    <div>
                      <div className="fg-eyebrow">APPLICATION GUIDANCE</div>
                      <h2>Quantity, schedule & method</h2>
                    </div>
                  </div>

                  <div className="fg-detail-body">
                    {result.application_rules?.length > 0 ? (
                      result.application_rules.map((rule, index) => (
                        <Rule key={rule.rule_id || index} rule={rule} />
                      ))
                    ) : (
                      <div className="fg-no-match">
                        No exact fertilizer-specific application rule
                        matched the model predictions. Quantity and
                        schedule have not been assigned.
                      </div>
                    )}

                    {result.unmatched_recommendations?.map((item, index) => (
                      <div className="fg-unmatched" key={index}>
                        <strong>
                          {item.category === 'organic'
                            ? 'Organic'
                            : 'Inorganic'} application rule unavailable
                        </strong>
                        <p>{item.message}</p>

                        {item.available_rules?.length > 0 && (
                          <details>
                            <summary>
                              See {item.available_rules.length} other
                              stage-matched reference options
                            </summary>
                            <ul>
                              {item.available_rules.map((rule, i) => (
                                <li key={rule.rule_id || i}>
                                  {rule.fertilizer} — {rule.verification_status}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    ))}

                    {result.additional_amendment_reference?.length > 0 && (
                      <details className="fg-amendments">
                        <summary>
                          Additional soil amendment references
                          (not automatically recommended)
                        </summary>
                        {result.additional_amendment_reference.map((rule, i) => (
                          <Rule key={rule.rule_id || i} rule={rule} />
                        ))}
                      </details>
                    )}
                  </div>
                </section>

              </>
            )}

            </>}
            <footer className="fg-footer">
              <span><Leaf size={15} /> Kegalle Research / Prototype</span>
              <span>Fertilizer recommendation system</span>
            </footer>
          </main>
        </div>
      </div>

      {/* ANALYSIS POPUP */}
      <dialog
        ref={dialogRef}
        className="fg-analysis-dialog"
        aria-labelledby="fg-dialog-title"
        onCancel={event => {
          event.preventDefault()
          closeAnalysis()
        }}
        onClose={() => setShowForm(false)}
      >
        <form onSubmit={submit}>
          <div className="fg-dialog-heading">
            <div>
              <div className="fg-eyebrow">FIELD INPUTS</div>
              <h2 id="fg-dialog-title">New fertilizer analysis</h2>
            </div>

            <button
              type="button"
              className="fg-icon-button"
              onClick={closeAnalysis}
              disabled={loading}
              aria-label="Close analysis"
            >
              <X size={20} />
            </button>
          </div>

          <p className="fg-dialog-intro">
            Enter your crop details and soil measurements to generate
            fertilizer recommendations.
          </p>

          <fieldset disabled={loading}>
            <legend>
              <span>01</span> Plant details
            </legend>

            <div className="fg-form-grid">
              <label>
                Crop
                <select
                  ref={firstInputRef}
                  value={form.crop}
                  onChange={e => changeCrop(e.target.value)}
                >
                  {Object.keys(STAGES).map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </label>

              <label>
                Growth stage
                <select
                  value={form.growth_stage}
                  onChange={e => update('growth_stage', e.target.value)}
                >
                  {STAGES[form.crop].map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </label>

              <label className="fg-full-width">
                Soil type
                <select
                  required
                  value={form.soil_type}
                  onChange={e => update('soil_type', e.target.value)}
                >
                  {SOIL_TYPES.map(soil => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
              </label>

              <label>
                Plant age (years)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Optional"
                  value={form.plant_age_years}
                  onChange={e => update('plant_age_years', e.target.value)}
                />
              </label>

              {form.crop === 'Rubber' && (
                <label>
                  Soil series
                  <select
                    value={form.soil_series}
                    onChange={e => update('soil_series', e.target.value)}
                  >
                    <option value="">Unknown</option>
                    <option value="Parambe">Parambe</option>
                  </select>
                </label>
              )}

              {form.crop === 'Rubber' &&
                form.growth_stage === 'Mature tapping' && (
                  <label>
                    Bark type
                    <select
                      value={form.bark_type}
                      onChange={e => update('bark_type', e.target.value)}
                    >
                      <option value="">Select bark type</option>
                      <option value="Virgin bark">Virgin bark</option>
                      <option value="Renewed bark">Renewed bark</option>
                    </select>
                  </label>
                )}
            </div>
          </fieldset>

          <fieldset disabled={loading}>
            <legend>
              <span>02</span> Soil measurements
            </legend>

            <div className="fg-form-grid">
              {NUMBERS.map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    type="number"
                    required
                    step="any"
                    min={['N', 'P', 'K', 'moisture', 'pH'].includes(key) ? 0 : undefined}
                    max={key === 'pH' ? 14 : key === 'moisture' ? 100 : undefined}
                    value={form[key]}
                    onChange={e => update(key, e.target.value)}
                  />
                </label>
              ))}
            </div>

            <p className="fg-field-note">
              NPK units are provisional until confirmed by the IoT team.
              Results are research prototypes, not field prescriptions.
            </p>
          </fieldset>

          <fieldset disabled={loading}>
            <legend><span>03</span> Explain my soil test</legend>
            <p className="fg-field-note">Optional: enter the reference values from your laboratory or crop adviser for {form.crop}, {form.growth_stage}. Measurements and thresholds must use the same units and test method. Without these, the explorer explains the model but does not diagnose nutrient deficiency.</p>
            <label className="fg-lab-toggle"><input type="checkbox" checked={lab.enabled} onChange={e => setLab(previous => ({ ...previous, enabled: e.target.checked }))} />I have a crop-specific laboratory reference</label>
            {lab.enabled && <div className="fg-form-grid">
              {['unit', 'method', 'source'].map(key => <label key={key}>{({ unit: 'NPK measurement units', method: 'Laboratory test method', source: 'Reference report or adviser' })[key]}<input required maxLength={key === 'source' ? 240 : key === 'method' ? 160 : 80} value={lab[key]} onChange={e => setLab(previous => ({ ...previous, [key]: e.target.value }))} /></label>)}
              {['N_min', 'P_min', 'K_min', 'pH_min', 'pH_max'].map(key => <label key={key}>{({ N_min: 'Nitrogen lower threshold', P_min: 'Phosphorus lower threshold', K_min: 'Potassium lower threshold', pH_min: 'Crop pH lower reference', pH_max: 'Crop pH upper reference' })[key]}<input type="number" min="0" max={key.startsWith('pH') ? 14 : undefined} step="any" placeholder="Optional" value={lab[key]} onChange={e => setLab(previous => ({ ...previous, [key]: e.target.value }))} /></label>)}
            </div>}
          </fieldset>

          <details className="fg-advanced">
            <summary>
              Optional: look up a specific fertilizer application rule
            </summary>
            <label>
              Exact fertilizer name
              <input
                placeholder="e.g. R/U 15:15:7 mixture"
                value={form.fertilizer_for_lookup}
                onChange={e => update('fertilizer_for_lookup', e.target.value)}
                disabled={loading}
              />
            </label>
            <p>
              This does not change the ML prediction. It only looks up
              a matching application rule.
            </p>
          </details>

          {error && (
            <div className="fg-error" role="alert">
              <AlertCircle size={17} />
              {error}
            </div>
          )}

          <div className="fg-dialog-actions">
            <button
              type="button"
              className="fg-secondary"
              onClick={closeAnalysis}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="fg-primary"
              disabled={loading}
            >
              {loading
                ? <LoaderCircle size={18} className="fg-spin" />
                : <Leaf size={18} />}
              {loading
                ? 'Analyzing soil…'
                : 'Get fertilizer recommendation'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}