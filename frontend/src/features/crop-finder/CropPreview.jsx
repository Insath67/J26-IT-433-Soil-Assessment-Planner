import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Sparkles } from 'lucide-react'
import './CropPreview.css'

const CROPS = {
  Tea: {
    image: '/images/crops/tea.jpg',
    symbol: '🍃',
    color: '#277744',
    botanical: 'Camellia sinensis',
  },
  Pepper: {
    image: '/images/crops/pepper.jpg',
    symbol: '🌿',
    color: '#436b35',
    botanical: 'Piper nigrum',
  },
  Cocoa: {
    image: '/images/crops/cocoa.jpg',
    symbol: '🍫',
    color: '#8b542e',
    botanical: 'Theobroma cacao',
  },
  Vanilla: {
    image: '/images/crops/vanilla.jpg',
    symbol: '🌼',
    color: '#9a741e',
    botanical: 'Vanilla planifolia',
  },
  Rubber: {
    image: '/images/crops/rubber.jpg',
    symbol: '🌳',
    color: '#236e58',
    botanical: 'Hevea brasiliensis',
  },
}

const COPY = {
  en: {
    photo: '{{crop}} photograph',
    unavailable: 'Crop photograph is not available yet.',
    viewReasons: 'View the reasons',
    close: 'Close crop preview',
    note: 'This is a model score from a synthetic-data prototype, not a guarantee of successful cultivation.',
  },
  si: {
    photo: '{{crop}} ඡායාරූපය',
    unavailable: 'බෝගයේ ඡායාරූපය තවම එක් කර නැත.',
    viewReasons: 'තෝරාගැනීමට හේතු බලන්න',
    close: 'බෝග විස්තර කවුළුව වසන්න',
    note: 'මෙය කෘත්‍රිම දත්ත මත ගොඩනැගූ මූලාකෘතියේ ලකුණකි. සාර්ථක වගාවක් පිළිබඳ සහතිකයක් නොවේ.',
  },
  ta: {
    photo: '{{crop}} புகைப்படம்',
    unavailable: 'பயிரின் புகைப்படம் இன்னும் சேர்க்கப்படவில்லை.',
    viewReasons: 'காரணங்களைப் பார்க்கவும்',
    close: 'பயிர் முன்னோட்டத்தை மூடவும்',
    note: 'இது செயற்கைத் தரவு முன்மாதிரியின் மதிப்பெண். வெற்றிகரமான சாகுபடிக்கான உத்தரவாதம் அல்ல.',
  },
}

const PARTICLES = Array.from({ length: 16 }, (_, index) => ({
  left: `${(index * 37 + 5) % 100}%`,
  delay: `${(index % 5) * 0.12}s`,
  duration: `${1.8 + (index % 4) * 0.15}s`,
  size: `${18 + (index % 4) * 7}px`,
  drift: `${((index % 5) - 2) * 45}px`,
  rotation: `${index % 2 === 0 ? 150 : -150}deg`,
}))

export default function CropPreview({
  crop,
  onClose,
  onViewReasons,
}) {
  const { t, i18n } = useTranslation('cropFinder')
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const [imageFailed, setImageFailed] = useState(false)
  const [animate, setAnimate] = useState(true)

  const language = i18n.resolvedLanguage || 'en'
  const copy = COPY[language] || COPY.en
  const details = CROPS[crop.crop]
  const cropName = t(crop.crop)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow

    if (dialog && !dialog.open) {
      dialog.showModal()
    }

    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const timer = window.setTimeout(() => {
      setAnimate(false)
    }, 3000)

    return () => {
      window.clearTimeout(timer)
      dialog?.close()
      document.body.style.overflow = previousOverflow

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus()
      }
    }
  }, [])

  if (!details) return null

  const score = new Intl.NumberFormat(
    language === 'si'
      ? 'si-LK'
      : language === 'ta'
        ? 'ta-LK'
        : 'en-LK',
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    },
  ).format(crop.score_percent)

  return (
    <dialog
      ref={dialogRef}
      className="crop-preview-dialog"
      aria-labelledby="crop-preview-title"
      aria-describedby="crop-preview-note"
      onCancel={event => {
        event.preventDefault()
        onClose()
      }}
      onClick={event => {
        if (event.target !== event.currentTarget) return

        const bounds = event.currentTarget.getBoundingClientRect()
        const outside =
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom

        if (outside) onClose()
      }}
      style={{ '--crop-preview-accent': details.color }}
    >
      {animate && (
        <div className="crop-celebration" aria-hidden="true">
          {PARTICLES.map((particle, index) => (
            <span
              className="crop-celebration-particle"
              key={index}
              style={{
                left: particle.left,
                fontSize: particle.size,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
                '--particle-drift': particle.drift,
                '--particle-rotation': particle.rotation,
              }}
            >
              {details.symbol}
            </span>
          ))}
        </div>
      )}

      <article className="crop-preview-card">
        <button
          ref={closeButtonRef}
          type="button"
          className="crop-preview-close"
          onClick={onClose}
          aria-label={copy.close}
        >
          <X size={22} aria-hidden="true" />
        </button>

        <div className="crop-preview-media">
          {!imageFailed ? (
            <img
              src={details.image}
              alt={copy.photo.replace('{{crop}}', cropName)}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="crop-preview-fallback">
              <span aria-hidden="true">{details.symbol}</span>
              <p>{copy.unavailable}</p>
            </div>
          )}
        </div>

        <div className="crop-preview-body">
          <p className="crop-preview-eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            {t('recommendations')}
          </p>

          <h2 id="crop-preview-title">{cropName}</h2>
          <p className="crop-preview-botanical" lang="la">
            {details.botanical}
          </p>

          <div className="crop-preview-score">
            <span>{t('modelScore')}</span>
            <strong>{score}%</strong>
          </div>

          <p id="crop-preview-note" className="crop-preview-note">
            {copy.note}
          </p>

          <button
            type="button"
            className="crop-preview-reasons"
            onClick={onViewReasons}
          >
            {copy.viewReasons}
          </button>
        </div>
      </article>
    </dialog>
  )
}