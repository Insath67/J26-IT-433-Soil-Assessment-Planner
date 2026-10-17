import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Leaf,
  LayoutGrid,
  Plus,
  ArrowRight,
  MapPin,
  Sun,
  Droplet,
  Sparkles,
  Download,
  X,
  Info,
} from 'lucide-react'

import CropPreview from './CropPreview'
import CropPhoto from './CropPhoto'
import CropReport from './CropReport'
import './App.css'

const API = `${import.meta.env.VITE_API_BASE_URL || '/api'}/crop-finder`

const CROPS = ['Tea', 'Pepper', 'Cocoa', 'Vanilla', 'Rubber']

const BOTANICAL = {
  Tea: 'Camellia sinensis',
  Pepper: 'Piper nigrum',
  Cocoa: 'Theobroma cacao',
  Vanilla: 'Vanilla planifolia',
  Rubber: 'Hevea brasiliensis',
}

const EMPTY = {
  N: '',
  P: '',
  K: '',
  ph: '',
  temperature: '',
  humidity: '',
  rainfall: '',
}

const BOUNDS = {
  N: [0, 10000],
  P: [0, 10000],
  K: [0, 10000],
  ph: [0, 14],
  temperature: [-9, 60],
  humidity: [0, 100],
  rainfall: [0, 15000],
}

const ICONS = {
  leaf: Leaf,
  grid: LayoutGrid,
  plus: Plus,
  arrow: ArrowRight,
  pin: MapPin,
  sun: Sun,
  drop: Droplet,
  spark: Sparkles,
  download: Download,
  close: X,
  info: Info,
}

const LOCALES = {
  en: 'en-LK',
  si: 'si-LK',
  ta: 'ta-LK',
}

function Icon({ name, size = 20 }) {
  const Component = ICONS[name] || Leaf

  return (
    <Component
      size={size}
      strokeWidth={1.7}
      aria-hidden="true"
    />
  )
}

async function requestApi(path, options = {}) {
  let response

  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      signal: AbortSignal.timeout(20000),
    })
  } catch {
    throw new Error('networkError')
  }

  if (!response.ok) {
    if (response.status === 503) {
      throw new Error('unavailableError')
    }

    if ([400, 422].includes(response.status)) {
      throw new Error('validationError')
    }

    throw new Error('requestError')
  }

  let data

  try {
    data = await response.json()
  } catch {
    throw new Error('responseError')
  }

  if (data.status === 'error') {
    throw new Error('requestError')
  }

  return data
}

export default function App() {
  const { t, i18n } = useTranslation('cropFinder')

  const [meta, setMeta] = useState(null)
  const [connection, setConnection] = useState('checking')
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [mode, setMode] = useState('manual')
  const [resultMode, setResultMode] = useState('manual')
  const [open, setOpen] = useState(false)
  const [help, setHelp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sample, setSample] = useState('Tea')
  const [previewCrop, setPreviewCrop] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')

  const dialog = useRef(null)
  const firstInput = useRef(null)
  const trigger = useRef(null)
  const printCleanupRef = useRef(null)

  const language = i18n.resolvedLanguage || 'en'
  const locale = LOCALES[language] || 'en-LK'

  function formatNumber(value, digits = 1) {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: digits,
    }).format(value)
  }

  function formatFixed(value, digits = 1) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value)
  }

  async function connect() {
    setConnection('checking')

    try {
      const metadata = await requestApi('/metadata')
      setMeta(metadata)
      setConnection('online')
    } catch {
      setConnection('offline')
    }
  }

  useEffect(() => {
    let mounted = true

    requestApi('/metadata')
      .then(data => {
        if (mounted) {
          setMeta(data)
          setConnection('online')
        }
      })
      .catch(() => {
        if (mounted) setConnection('offline')
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (open) {
      if (!dialog.current?.open) {
        dialog.current?.showModal()
      }
      firstInput.current?.focus()
    } else if (dialog.current?.open) {
      dialog.current.close()
      trigger.current?.focus()
    }
  }, [open])

  useEffect(() => {
    return () => {
      printCleanupRef.current?.()
    }
  }, [])

  const predictions = result?.recommendations || []
  const active =
    predictions.find(item => item.crop === selected) ||
    predictions[0]

  const values = result?.inputs
  const ordered = predictions.length
    ? predictions
    : CROPS.map(crop => ({ crop }))

  const top = predictions[0]?.crop
  const factors = active?.factors || []
  const warnings = result?.warnings || []

  const maxImpact = Math.max(
    ...factors.map(factor => Math.abs(factor.shap_value)),
    0.001,
  )

  const weatherCaption = result
    ? t(resultMode === 'live' ? 'liveSource' : 'manualSource')
    : t('awaiting')

  const metrics = [
    {
      key: 'ph',
      icon: 'leaf',
      unit: '',
      caption: t('acidity'),
    },
    {
      key: 'temperature',
      icon: 'sun',
      unit: '°C',
      caption: weatherCaption,
    },
    {
      key: 'humidity',
      icon: 'drop',
      unit: '%',
      caption: weatherCaption,
    },
    {
      key: 'rainfall',
      icon: 'leaf',
      unit: 'mm',
      caption: t('annualBasis'),
    },
  ]

  function startAnalysis() {
    setError('')
    setOpen(true)
  }

  function fillSample() {
    const sampleValues = meta?.samples?.[sample]
    if (!sampleValues) return

    setForm(
      Object.fromEntries(
        Object.entries(sampleValues).map(([key, value]) => [
          key,
          String(Number(value.toFixed(2))),
        ]),
      ),
    )

    setMode('manual')
    setError('')
  }

  async function analyze(event) {
    event.preventDefault()
    setError('')
    setExportError('')
    setLoading(true)

    const body = { weather_mode: mode }
    const fields =
      mode === 'live'
        ? ['N', 'P', 'K', 'ph', 'rainfall']
        : Object.keys(EMPTY)

    for (const field of fields) {
      body[field] = Number(form[field])
    }

    try {
      const data = await requestApi('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      setResult(data)
      setResultMode(mode)
      setSelected(data.recommended_crop)
      setConnection('online')
      setOpen(false)
    } catch (err) {
      setError(err.message || 'requestError')
    } finally {
      setLoading(false)
    }
  }

  async function exportResult() {
    if (!result || printCleanupRef.current) return

    setExportError('')
    setExporting(true)

    const previousTitle = document.title
    let finished = false

    function cleanup() {
      if (finished) return
      finished = true

      document.body.classList.remove('saru-print-report')
      document.title = previousTitle
      window.removeEventListener('afterprint', cleanup)
      printCleanupRef.current = null
      setExporting(false)
    }

    printCleanupRef.current = cleanup
    window.addEventListener('afterprint', cleanup)

    try {
      const analysisId = String(result.analysis_id || 'analysis')

      document.title =
        `Saru-Bima-Crop-Report-${analysisId.slice(0, 8)}`

      document.body.classList.add('saru-print-report')

      // Explicitly load the report's fonts, including hidden report text.
      await Promise.all([
        document.fonts.load(
          '400 16px "Noto Sans Sinhala Variable"',
          'සරු බිම',
        ),
        document.fonts.load(
          '400 16px "Noto Sans Tamil Variable"',
          'பயிர்',
        ),
      ])

      await document.fonts.ready

      // Allow the browser to apply the print preparation.
      await new Promise(resolve => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(resolve)
        })
      })

      if (finished) return

      if (!document.querySelector('.crop-print-report')) {
        throw new Error('Report component is missing')
      }

      window.print()
    } catch {
      cleanup()
      setExportError('requestError')
    }
  }

  function viewReasons() {
    setPreviewCrop(null)

    window.requestAnimationFrame(() => {
      const heading = document.getElementById('why-title')
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      heading?.focus({ preventScroll: true })
      heading?.scrollIntoView({
        behavior: reduceMotion ? 'instant' : 'smooth',
        block: 'center',
      })
    })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#main">
          <span className="brand-symbol">
            <Icon name="leaf" size={25} />
          </span>

          <span>
            <span lang="en">Saru Bima</span>{' '}
            <span lang="si">සරු බිම</span>
            <span className="brand-sub">
              {t('smartAgriculture')}
            </span>
          </span>
        </a>

        <div className="workspace-label">{t('workspace')}</div>

        <nav aria-label={t('navigation')}>
          <a href="#main" className="nav-item current">
            <Icon name="grid" />
            {t('recommendations')}
            <Icon name="arrow" size={15} />
          </a>

          <button className="nav-item" onClick={startAnalysis}>
            <Icon name="plus" />
            {t('newAnalysis')}
          </button>

          <button
            className={`nav-item ${help ? 'help-active' : ''}`}
            onClick={() => setHelp(!help)}
            aria-expanded={help}
          >
            <Icon name="info" />
            {t('howItWorks')}
          </button>
        </nav>

        <div className="sidebar-note">
          <span className="mini-leaf">
            <Icon name="leaf" size={30} />
          </span>

          <h3>{t('betterInsights')}</h3>
          <p>{t('sidebarDescription')}</p>

          <button onClick={startAnalysis}>
            {t('exploreField')}
            <Icon name="arrow" size={16} />
          </button>
        </div>

        <div className="sidebar-bottom">
          <span className="avatar">KB</span>
          <span>
            {t('research')}
            <span className="subtle">{t('module')}</span>
          </span>
        </div>
      </aside>

      <div className="page-wrap">
        <header className="topbar">
          <span>
            {t('workspace')}
            <span className="slash"> / </span>
            <strong>{t('planning')}</strong>
          </span>

          <button
            className={`connection ${connection}`}
            onClick={connect}
            aria-label={t('checkConnection')}
          >
            <i />
            {t(connection)}
          </button>
        </header>

        <main id="main">
          <div className="page-heading">
            <div>
              <div className="eyebrow">{t('eyebrow')}</div>
              <h1>{t('recommendations')}<span>.</span></h1>
              <p>{t('introduction')}</p>
            </div>

            <button
              className="primary"
              onClick={startAnalysis}
              ref={trigger}
            >
              <Icon name="plus" size={18} />
              {t('newAnalysis')}
            </button>
          </div>

          <div className="context-row">
            <span>
              <Icon name="pin" size={17} />
              <strong>{t('district')}</strong>
              <span className="context-muted">{t('country')}</span>
            </span>
            <span className="demo-tag">{t('demo')}</span>
          </div>

          {help && (
            <section className="help-panel">
              <h2>{t('helpTitle')}</h2>
              <p>{t('helpBody')}</p>
              <p>{t('limitation')}</p>
            </section>
          )}

          <section className="metrics" aria-label={t('inputs')}>
            {metrics.map(metric => {
              const value = values?.[metric.key]

              return (
                <div className="metric" key={metric.key}>
                  <div className="metric-top">
                    <span>{t(metric.key)}</span>
                    <Icon name={metric.icon} size={18} />
                  </div>

                  <div className="metric-value">
                    {value == null ? '—' : formatNumber(value)}
                    <span>{value == null ? '' : metric.unit}</span>
                  </div>

                  <div className="metric-caption">
                    {metric.caption}
                  </div>
                </div>
              )
            })}
          </section>

          <div className="section-heading">
            <div>
              <h2>
                {t('shortlist')} <span>{t('cropCount')}</span>
              </h2>
              <p>{t(result ? 'ranked' : 'runPrompt')}</p>
            </div>

            {result && (
              <button
                type="button"
                className="text-button"
                onClick={exportResult}
                disabled={exporting}
                aria-busy={exporting}
              >
                {exporting
                  ? <span className="spinner" />
                  : <Icon name="download" size={16} />}
                {t('export')}
              </button>
            )}
          </div>

          {exportError && (
            <div className="form-error" role="alert">
              {t(exportError)}
            </div>
          )}

          <section
            className="crop-grid"
            aria-label={t('recommendations')}
          >
            {ordered.map((item, index) => (
              <button
                key={item.crop}
                disabled={!result}
                className={`crop-card ${
                  index === 0 ? 'featured' : ''
                } ${active?.crop === item.crop ? 'selected' : ''}`}
                onClick={() => {
                  setSelected(item.crop)
                  setPreviewCrop(item)
                }}
                aria-pressed={active?.crop === item.crop}
              >
                <div className="crop-top">
                  <span className="crop-icon">
                    <Icon name="leaf" size={index === 0 ? 26 : 21} />
                  </span>

                  {index === 0 ? (
                    <span className="match-tag">
                      {t(result ? 'topMatch' : 'nextInsight')}
                    </span>
                  ) : (
                    <span className="rank">0{index + 1}</span>
                  )}
                </div>

                <CropPhoto key={item.crop} crop={item.crop} />

                <div className="crop-main">
                  <div>
                    <h3>{t(item.crop)}</h3>
                    <p lang="la">{BOTANICAL[item.crop]}</p>
                  </div>

                  <div className="crop-score">
                    {item.score_percent == null
                      ? '—'
                      : formatFixed(item.score_percent)}
                    {item.score_percent != null && <span>%</span>}
                  </div>
                </div>

                {index === 0 && (
                  <p className="featured-copy">
                    {t(result ? 'featuredResult' : 'featuredEmpty')}
                  </p>
                )}

                <div className="score-meta">
                  <span>{t('modelScore')}</span>
                  <span>
                    {t(
                      !result
                        ? 'awaiting'
                        : active?.crop === item.crop
                          ? 'viewing'
                          : 'factorsLink',
                    )}
                  </span>
                </div>

                <div className="progress-track">
                  <span
                    style={{ width: `${item.score_percent || 0}%` }}
                  />
                </div>
              </button>
            ))}
          </section>

          {!result && (
            <div className="empty-action">
              <Icon name="spark" />
              <span>{t('emptyPrompt')}</span>

              <button onClick={startAnalysis}>
                {t('start')}
                <Icon name="arrow" size={16} />
              </button>
            </div>
          )}

          <section
            className="insight-panel"
            aria-labelledby="why-title"
            aria-live="polite"
          >
            <div className="insight-header">
              <div className="insight-title">
                <span className="insight-icon">
                  <Icon name="spark" size={23} />
                </span>

                <div>
                  <div className="eyebrow">{t('explainable')}</div>
                  <h2 id="why-title" tabIndex={-1}>
                    {active
                      ? t(active.crop === top ? 'why' : 'scoreWhy', {
                          crop: t(active.crop),
                        })
                      : t('understandWhy')}
                  </h2>
                </div>
              </div>

              <span className="explain-pill">
                {t(active ? 'featureExplanation' : 'ready')}
              </span>
            </div>

            {active ? (
              <div className="insight-content">
                <div className="explanation">
                  <p className="explanation-lead">
                    {t('explanation', { crop: t(active.crop) })}
                  </p>

                  <div className="legend">
                    <span>
                      <i className="positive-dot" />
                      {t('supports')}
                    </span>
                    <span>
                      <i className="negative-dot" />
                      {t('lowers')}
                    </span>
                  </div>

                  <p className="explanation-note">{t('shapNote')}</p>
                </div>

                <div className="factors">
                  {factors.map(factor => {
                    const width =
                      Math.abs(factor.shap_value) / maxImpact * 50
                    const negative = factor.shap_value < 0

                    return (
                      <div className="factor" key={factor.feature}>
                        <div className="factor-label">
                          <span>
                            {t(factor.feature)}{' '}
                            <small>
                              {formatNumber(factor.value, 2)}
                            </small>
                          </span>

                          <strong
                            className={negative ? 'negative' : 'positive'}
                          >
                            {factor.shap_value > 0 ? '+' : ''}
                            {formatFixed(factor.shap_value, 3)}
                          </strong>
                        </div>

                        <div className="factor-axis">
                          <span
                            className={`factor-bar ${
                              negative ? 'negative-bar' : ''
                            }`}
                            style={{
                              width: `${width}%`,
                              left: negative ? `${50 - width}%` : '50%',
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="insight-empty">
                <p>{t('explanationEmpty')}</p>
                <span>{t('explanationLater')}</span>
              </div>
            )}
          </section>

          {result && (
            <>
              <div className="nutrient-summary">
                <strong>{t('soilUsed')}</strong>
                <span>N {formatNumber(values.N, 2)}</span>
                <span>P {formatNumber(values.P, 2)}</span>
                <span>K {formatNumber(values.K, 2)}</span>
                <small>{t('unitsNote')}</small>
              </div>

              {warnings.length > 0 && (
                <div className="warnings" role="status">
                  <strong>{t('warningTitle')}</strong>
                  <p>
                    {t('warningSummary', { count: warnings.length })}
                  </p>

                  <button
                    type="button"
                    className="text-button"
                    onClick={exportResult}
                    disabled={exporting}
                    aria-busy={exporting}
                  >
                    {t('export')}
                  </button>
                </div>
              )}
            </>
          )}

          <footer>
            <span>
              <Icon name="leaf" size={15} />
              {t('research')}
              <span className="footer-divider">/</span>
              {t('prototype')}
            </span>

            <span>
              {result
                ? t('analyzed', {
                    date: new Date(result.created_at).toLocaleString(locale),
                  })
                : t('footer')}
            </span>
          </footer>
        </main>
      </div>

      <dialog
        ref={dialog}
        className="analysis-dialog"
        aria-labelledby="analysis-title"
        onCancel={event => {
          event.preventDefault()
          if (!loading) setOpen(false)
        }}
      >
        <form onSubmit={analyze}>
          <div className="dialog-heading">
            <div>
              <div className="eyebrow">{t('fieldInputs')}</div>
              <h2 id="analysis-title">{t('dialogTitle')}</h2>
            </div>

            <button
              type="button"
              className="icon-button"
              onClick={() => setOpen(false)}
              disabled={loading}
              aria-label={t('close')}
            >
              <Icon name="close" />
            </button>
          </div>

          <p className="dialog-intro">{t('dialogIntro')}</p>

          <div className="sample-row">
            <label htmlFor="sample">{t('sample')}</label>

            <select
              id="sample"
              value={sample}
              onChange={event => setSample(event.target.value)}
              disabled={loading}
            >
              {CROPS.map(crop => (
                <option key={crop} value={crop}>
                  {t(crop)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={fillSample}
              disabled={!meta || loading}
            >
              {t('loadSample')}
            </button>
          </div>

          <fieldset disabled={loading}>
            <legend>
              01 <span>{t('soilMeasurements')}</span>
            </legend>

            <div className="form-grid">
              {['N', 'P', 'K', 'ph'].map((field, index) => (
                <label key={field} htmlFor={field}>
                  {t(field)}
                  <input
                    ref={index === 0 ? firstInput : null}
                    id={field}
                    type="number"
                    step="any"
                    min={BOUNDS[field][0]}
                    max={BOUNDS[field][1]}
                    value={form[field]}
                    required
                    onChange={event => {
                      setForm({ ...form, [field]: event.target.value })
                    }}
                    placeholder={t(
                      field === 'ph' ? 'examplePh' : 'enterValue',
                    )}
                  />
                </label>
              ))}
            </div>

            <p className="field-note">{t('nutrientScale')}</p>
          </fieldset>

          <fieldset disabled={loading}>
            <legend>
              02 <span>{t('climateInputs')}</span>
            </legend>

            <div className="mode-toggle">
              <label>
                <input
                  type="radio"
                  name="weather"
                  checked={mode === 'manual'}
                  onChange={() => setMode('manual')}
                />
                {t('manualWeather')}
              </label>

              <label>
                <input
                  type="radio"
                  name="weather"
                  checked={mode === 'live'}
                  onChange={() => setMode('live')}
                />
                {t('liveWeather')}
              </label>
            </div>

            {mode === 'live' ? (
              <p className="live-note">
                <Icon name="sun" size={17} />
                {t('liveNote')}
              </p>
            ) : (
              <div className="form-grid">
                {['temperature', 'humidity'].map(field => (
                  <label key={field} htmlFor={field}>
                    {t(field)}
                    <input
                      id={field}
                      type="number"
                      step="any"
                      min={BOUNDS[field][0]}
                      max={BOUNDS[field][1]}
                      value={form[field]}
                      required
                      onChange={event => {
                        setForm({ ...form, [field]: event.target.value })
                      }}
                    />
                  </label>
                ))}
              </div>
            )}

            <label className="rainfall-label" htmlFor="rainfall">
              {t('rainfall')}
              <input
                id="rainfall"
                type="number"
                step="any"
                min={BOUNDS.rainfall[0]}
                max={BOUNDS.rainfall[1]}
                required
                value={form.rainfall}
                onChange={event => {
                  setForm({ ...form, rainfall: event.target.value })
                }}
                placeholder={t('exampleRain')}
              />
            </label>

            <p className="field-note">{t('rainNote')}</p>
          </fieldset>

          {error && (
            <div className="form-error" role="alert">
              {t(error)}
            </div>
          )}

          <div className="dialog-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {t('cancel')}
            </button>

            <button
              type="submit"
              className="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  {t('analyzing')}
                </>
              ) : (
                <>
                  <Icon name="spark" size={17} />
                  {t('getRecommendation')}
                </>
              )}
            </button>
          </div>
        </form>
      </dialog>

      {previewCrop && (
        <CropPreview
          key={previewCrop.crop}
          crop={previewCrop}
          onClose={() => setPreviewCrop(null)}
          onViewReasons={viewReasons}
        />
      )}

      <CropReport result={result} />
    </div>
  )
}