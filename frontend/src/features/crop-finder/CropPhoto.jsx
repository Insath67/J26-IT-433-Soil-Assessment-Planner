import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PHOTOS = {
  Tea: '/images/crops/tea.jpg',
  Pepper: '/images/crops/pepper.jpg',
  Cocoa: '/images/crops/cocoa.jpg',
  Vanilla: '/images/crops/vanilla.jpg',
  Rubber: '/images/crops/rubber.jpg',
}

export default function CropPhoto({ crop }) {
  const { t } = useTranslation('cropFinder')
  const [failed, setFailed] = useState(false)

  return (
    <div className="crop-card-photo">
      {!failed && PHOTOS[crop] ? (
        <img
          src={PHOTOS[crop]}
          alt={t(crop)}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="crop-card-photo-fallback" aria-hidden="true">
          🌿
        </span>
      )}
    </div>
  )
}