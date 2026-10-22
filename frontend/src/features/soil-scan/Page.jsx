import { useEffect, useRef, useState } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Info,
  Layers3,
  Leaf,
  Loader2,
  MapPin,
  Plus,
  RotateCcw,
  ScanLine,
  Upload,
  X,
} from 'lucide-react'
import { requestApi } from '@/services/api'
import './Page.css'

const SOIL_CLASSES = ['Clay', 'Loam', 'Sand']
const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const SUPPORTED_EXTENSIONS = /\.(jpe?g|png|webp)$/i

function isPredictionResponse(data) {
  return (
    data?.status === 'success' &&
    SOIL_CLASSES.includes(data.predicted_class) &&
    typeof data.confidence === 'number' &&
    Number.isFinite(data.confidence) &&
    data.confidence >= 0 &&
    data.confidence <= 1 &&
    SOIL_CLASSES.every(
      soilClass =>
        typeof data.probabilities?.[soilClass] === 'number' &&
        Number.isFinite(data.probabilities[soilClass]) &&
        data.probabilities[soilClass] >= 0 &&
        data.probabilities[soilClass] <= 1
    )
  )
}

export default function Page() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [help, setHelp] = useState(false)
  const [connection, setConnection] = useState('checking')
  const fileInputRef = useRef(null)
  const uploadRef = useRef(null)

  useEffect(() => {
    if (!preview) return undefined
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  useEffect(() => {
    let mounted = true

    requestApi('/health')
      .then(data => {
        if (mounted) setConnection(data?.status === 'ok' ? 'online' : 'offline')
      })
      .catch(() => {
        if (mounted) setConnection('offline')
      })

    return () => {
      mounted = false
    }
  }, [])

  function resetScan() {
    setFile(null)
    setPreview('')
    setResult(null)
    setError('')
    setBusy(false)
    setDragActive(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function startAnalysis() {
    if (busy) return
    resetScan()
    window.requestAnimationFrame(() => {
      uploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      fileInputRef.current?.click()
    })
  }

  function acceptFile(selectedFile) {
    setResult(null)
    setError('')

    if (!selectedFile) return

    if (!selectedFile.size) {
      setFile(null)
      setPreview('')
      setError('This image is empty. Please choose another file.')
      return
    }

    if (
      !SUPPORTED_EXTENSIONS.test(selectedFile.name) ||
      (selectedFile.type && !SUPPORTED_TYPES.has(selectedFile.type))
    ) {
      setFile(null)
      setPreview('')
      setError('Unsupported file type. Choose a JPG, JPEG, PNG or WEBP image.')
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  function handleFileChange(event) {
    acceptFile(event.target.files?.[0])
    event.target.value = ''
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragActive(false)
    if (busy) return
    acceptFile(event.dataTransfer.files?.[0])
  }

  async function analyzeSoil() {
    if (busy) return
    if (!file) {
      setError('Please select a soil image first.')
      return
    }

    setBusy(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const data = await requestApi('/soil-scan/predict', {
        method: 'POST',
        body: formData,
      })

      if (!isPredictionResponse(data)) {
        throw new Error('The server returned an invalid prediction. Please try again.')
      }

      setResult(data)
      setConnection('online')
    } catch (requestError) {
      setError(
        requestError instanceof SyntaxError
          ? 'The server returned an unreadable response. Please try again.'
          : requestError.message || 'Soil classification failed. Please try again.'
      )
      setConnection('offline')
    } finally {
      setBusy(false)
    }
  }

  const metrics = [
    {
      label: 'Image input',
      value: '224 × 224',
      caption: 'Model image dimensions',
      icon: ScanLine,
    },
    {
      label: 'Model',
      value: 'EfficientNetB0',
      caption: 'Integrated classification model',
      icon: Cpu,
    },
    {
      label: 'Soil classes',
      value: '3',
      caption: result ? `Predicted: ${result.predicted_class}` : 'Clay · Loam · Sand',
      icon: Layers3,
    },
    {
      label: 'Analysis status',
      value: busy ? 'Analyzing' : result ? 'Complete' : 'Awaiting analysis',
      caption: result ? 'Latest image classified' : 'Upload an image to begin',
      icon: Activity,
    },
  ]

  return (
    <div className="ss-module">
      <div className="ss-app-shell">
        <aside className="ss-sidebar">
          <a className="ss-brand" href="#soil-main">
            <span className="ss-brand-symbol">
              <Leaf size={25} aria-hidden="true" />
            </span>
            <span>
              <span>Saru Bima</span>{' '}
              <span lang="si">සරු බිම</span>
              <small>SMART AGRICULTURE</small>
            </span>
          </a>

          <div className="ss-workspace-label">RESEARCH WORKSPACE</div>

          <nav className="ss-nav" aria-label="Soil Scan navigation">
            <a href="#soil-main" className="ss-nav-item ss-current" aria-current="page">
              <ScanLine size={19} aria-hidden="true" />
              <span>Soil Scan</span>
              <ArrowRight size={16} className="ss-nav-arrow" aria-hidden="true" />
            </a>
            <button
              type="button"
              className="ss-nav-item"
              onClick={startAnalysis}
              disabled={busy}
            >
              <Plus size={19} aria-hidden="true" />
              <span>New analysis</span>
            </button>
            <button
              type="button"
              className={`ss-nav-item${help ? ' ss-help-active' : ''}`}
              onClick={() => setHelp(!help)}
              aria-expanded={help}
              aria-controls="soil-help"
            >
              <Info size={19} aria-hidden="true" />
              <span>How it works</span>
            </button>
          </nav>

          <div className="ss-sidebar-note">
            <Leaf size={29} aria-hidden="true" />
            <h3>Start with the soil.</h3>
            <p>Explore an image-based soil classification in this research demo.</p>
            <button type="button" onClick={startAnalysis} disabled={busy}>
              Choose an image <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="ss-sidebar-bottom">
            <span className="ss-avatar">KB</span>
            <span>
              Kegalle Research
              <small>Soil Scan module</small>
            </span>
          </div>
        </aside>

        <div className="ss-page-wrap">
          <header className="ss-topbar">
            <span>
              Research workspace
              <span className="ss-slash"> / </span>
              <strong>Soil analysis</strong>
            </span>
            <span className={`ss-connection ${connection}`} role="status">
              <i />
              {connection === 'online'
                ? 'Engine connected'
                : connection === 'offline'
                  ? 'Engine unavailable'
                  : 'Checking engine'}
            </span>
          </header>

          <main id="soil-main" className="ss-main">
            <div className="ss-page-heading">
              <div>
                <div className="ss-eyebrow">START WITH YOUR SOIL</div>
                <h1>Soil scanning<span>.</span></h1>
                <p>Upload a soil image and use AI to classify the soil type.</p>
              </div>
              <button
                type="button"
                className="ss-primary"
                onClick={startAnalysis}
                disabled={busy}
              >
                <Plus size={18} aria-hidden="true" />
                New analysis
              </button>
            </div>

            <div className="ss-context-row">
              <span className="ss-location">
                <MapPin size={17} aria-hidden="true" />
                <strong>Kegalle District</strong>
                <span>Sri Lanka</span>
              </span>
              <span className="ss-demo-tag">AI MODEL · RESEARCH DEMO</span>
            </div>

            {help && (
              <section className="ss-help-panel" id="soil-help" aria-labelledby="soil-help-title">
                <h2 id="soil-help-title">How soil image analysis works</h2>
                <p>
                  Upload a soil image and the integrated EfficientNetB0 model
                  returns a predicted soil class and its class probabilities.
                </p>
                <p>
                  This is a research demo. Results describe the model&apos;s
                  image classification and are not agricultural recommendations.
                </p>
              </section>
            )}

            <section className="ss-metrics" aria-label="Soil Scan metrics">
              {metrics.map(metric => {
                const Icon = metric.icon
                return (
                  <article className="ss-metric" key={metric.label}>
                    <div className="ss-metric-top">
                      <span>{metric.label}</span>
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div className="ss-metric-value">{metric.value}</div>
                    <div className="ss-metric-caption">{metric.caption}</div>
                  </article>
                )
              })}
            </section>

            <div className="ss-section-heading">
              <div>
                <h2>Soil image analysis <span>IMAGE CLASSIFICATION</span></h2>
                <p>Upload a clear image of the soil you want to analyze.</p>
              </div>
            </div>

            <section className="ss-analysis-grid" aria-label="Soil image analysis">
              <article className="ss-upload-card" aria-labelledby="soil-upload-title">
                <div className="ss-card-heading">
                  <div className="ss-card-icon">
                    <Upload size={21} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 id="soil-upload-title">Upload soil image</h3>
                    <p>Choose an image from your device or drop it here.</p>
                  </div>
                </div>

                <label
                  ref={uploadRef}
                  className={`ss-upload-area${dragActive ? ' is-drag-active' : ''}${preview ? ' has-preview' : ''}`}
                  onDragEnter={event => {
                    event.preventDefault()
                    if (!busy) setDragActive(true)
                  }}
                  onDragOver={event => event.preventDefault()}
                  onDragLeave={event => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setDragActive(false)
                    }
                  }}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt={`Preview of ${file.name}`} className="ss-preview" />
                      <span className="ss-preview-overlay">
                        <Upload size={17} aria-hidden="true" />
                        Choose a different image
                      </span>
                    </>
                  ) : (
                    <span className="ss-upload-prompt">
                      <span className="ss-upload-icon">
                        <Upload size={24} aria-hidden="true" />
                      </span>
                      <strong>Choose or drop a soil image</strong>
                      <span>JPG, JPEG, PNG or WEBP</span>
                    </span>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    aria-label="Choose a soil image"
                    disabled={busy}
                  />
                </label>

                {file && (
                  <div className="ss-file-name">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={resetScan}
                      disabled={busy}
                      aria-label="Remove selected image"
                    >
                      <X size={17} aria-hidden="true" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="ss-primary ss-analyze-button"
                  onClick={analyzeSoil}
                  disabled={!file || busy}
                >
                  {busy ? (
                    <>
                      <Loader2 size={18} className="ss-spin" aria-hidden="true" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ScanLine size={18} aria-hidden="true" />
                      Analyze soil
                    </>
                  )}
                </button>
                <p className="ss-upload-footnote">Supported formats: JPG, JPEG, PNG and WEBP</p>
              </article>

              {error ? (
                <section className="ss-state-card ss-error-card" role="alert">
                  <span className="ss-state-icon">
                    <AlertCircle size={23} aria-hidden="true" />
                  </span>
                  <h3>Analysis could not be completed</h3>
                  <p>{error}</p>
                  <button type="button" className="ss-secondary" onClick={resetScan}>
                    <RotateCcw size={16} aria-hidden="true" />
                    Try another image
                  </button>
                </section>
              ) : result ? (
                <section className="ss-result-card" aria-labelledby="soil-result-title">
                  <div className="ss-result-header">
                    <div>
                      <p className="ss-result-eyebrow">AI CLASSIFICATION</p>
                      <h3 id="soil-result-title">AI soil classification</h3>
                    </div>
                    <CheckCircle2 size={25} aria-hidden="true" />
                  </div>

                  <div className="ss-prediction">
                    <span>Predicted soil type</span>
                    <strong>{result.predicted_class}</strong>
                  </div>

                  <div className="ss-confidence">
                    <span>Confidence</span>
                    <strong>{(result.confidence * 100).toFixed(2)}%</strong>
                  </div>

                  <div className="ss-probabilities">
                    <h4>Probability distribution</h4>
                    {SOIL_CLASSES.map(soilClass => {
                      const probability = result.probabilities[soilClass]
                      const percentage = probability * 100
                      const isPredicted = soilClass === result.predicted_class

                      return (
                        <div
                          key={soilClass}
                          className={`ss-probability${isPredicted ? ' is-predicted' : ''}`}
                        >
                          <div className="ss-probability-label">
                            <span>
                              {soilClass}
                              {isPredicted && <span className="ss-predicted-badge">Predicted</span>}
                            </span>
                            <strong>{percentage.toFixed(2)}%</strong>
                          </div>
                          <div
                            className="ss-progress"
                            role="progressbar"
                            aria-label={`${soilClass} probability`}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-valuenow={percentage.toFixed(2)}
                          >
                            <div className="ss-progress-value" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <p className="ss-result-note">
                    The classification is generated from the uploaded soil image
                    using the integrated EfficientNetB0 model.
                  </p>
                  <button type="button" className="ss-secondary" onClick={resetScan}>
                    <RotateCcw size={16} aria-hidden="true" />
                    Scan another image
                  </button>
                </section>
              ) : (
                <section className="ss-state-card" aria-live="polite">
                  <span className="ss-state-icon">
                    {busy ? (
                      <Loader2 size={23} className="ss-spin" aria-hidden="true" />
                    ) : (
                      <ScanLine size={23} aria-hidden="true" />
                    )}
                  </span>
                  <h3>{busy ? 'Analyzing soil image' : file ? 'Image ready for analysis' : 'Awaiting soil image'}</h3>
                  <p>
                    {busy
                      ? 'The model is processing your uploaded image.'
                      : file
                        ? 'Your image is ready. Select Analyze soil to see the classification.'
                        : 'Upload a clear soil image to begin analysis.'}
                  </p>
                  {busy && <span className="ss-loading-indicator">Processing image</span>}
                </section>
              )}
            </section>

            {result && (
              <div className="ss-result-status" role="status">
                <CheckCircle2 size={16} aria-hidden="true" />
                Prediction received from the soil classification API.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
