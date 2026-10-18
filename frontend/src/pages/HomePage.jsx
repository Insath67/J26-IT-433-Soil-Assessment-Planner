import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Leaf,
} from 'lucide-react'
import { modules } from '../shared/modules'
import ModuleIcon from '../shared/ModuleIcon'
import { useEffect, useRef } from 'react'

export default function HomePage() {
  const { t } = useTranslation()
  const videoRef = useRef(null)
  

  // Background video playback
  useEffect(() => {
    const video = videoRef.current
    const preference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    function applyPreference() {
      if (!video) return

      if (preference.matches) {
        video.pause()
      } else {
        video.play().catch(() => {
          // User can start playback using the button.
        })
      }
    }

    applyPreference()
    preference.addEventListener('change', applyPreference)

    return () => {
      preference.removeEventListener('change', applyPreference)
    }
  }, [])

  // Apply background styles only while HomePage is open
  useEffect(() => {
    document.body.classList.add('saru-home-active')

    return () => {
      document.body.classList.remove('saru-home-active')
    }
  }, [])

  // මෙතැනින් පස්සේ දැනට තියෙන toggleBackgroundVideo()
  // function එක සහ return (...) කොටස එහෙමම තියාගන්න.



  return (
    <main id="content" className="home-page">
      <section className="home-hero home-hero-background">
  <video
  ref={videoRef}
  className="hero-background-video"
  muted
  loop
  playsInline
  preload="metadata"
  aria-hidden="true"
  tabIndex={-1}
  
>
    <source
      src="/videos/saru-bima-hero.mp4"
      type="video/mp4"
    />
  </video>

  <div className="hero-background-overlay" aria-hidden="true" />
        <div className="home-hero-copy">
          <div className="location-pill">
            <MapPin size={14} />
            {t('home.location')}
          </div>

          <h1>
            {t('home.heading')}
            <br />
            <em>{t('home.headingAccent')}</em>
          </h1>

          <p className="brand-tagline">
            {t('home.tagline')}
          </p>

          <p>{t('home.intro')}</p>

          <br />

          <p>
            <strong>{t('home.welcomeTitle')}</strong>
          </p>

          <p>{t('home.welcomeBody')}</p>

          <br />

          <b>{t('home.welcome')}</b>

          <div className="hero-actions">
            <Link className="site-button" to="/crop-finder">
              {t('home.findCrop')}
              <ArrowUpRight size={19} />
            </Link>
           

            <a className="text-link" href="#explore">
              {t('home.explore')}
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="hero-footnote">
            <span className="leaf-stamp">
              <Leaf size={21} />
            </span>

            <span>
              {t('home.footnote')}
              <br />
              <strong>{t('home.footnoteStrong')}</strong>
            </span>
          </div>
        </div>

        
      </section>

      <section
        id="explore"
        className="explore-section"
        aria-labelledby="explore-title"
      >
        <div className="explore-heading">
          <div>
            <p className="site-eyebrow">
              {t('home.eyebrow')}
            </p>
            <h2 id="explore-title">
              {t('home.exploreTitle')}
            </h2>
          </div>

          <p>{t('home.exploreDescription')}</p>
        </div>

        <div className="module-grid">
          {modules.map(module => (
            <Link
              className={`module-card ${
                module.slug === 'crop-finder' ? 'module-featured' : ''
              }`}
              key={module.slug}
              to={`/${module.slug}`}
            >
              <div className="module-card-top">
                <span className="module-symbol">
                  <ModuleIcon name={module.icon} size={27} />
                </span>

                <span className="module-number">
                  {module.number}
                </span>
              </div>

              <p className="module-eyebrow">
                {t(`modules.${module.slug}.eyebrow`)}
              </p>

              <h3>{t(`nav.${module.slug}`)}</h3>

              <p className="module-description">
                {t(`modules.${module.slug}.description`)}
              </p>

              <div className="module-card-bottom">
                <span>
                  {t(`modules.${module.slug}.status`)}
                </span>
                <ArrowUpRight size={21} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="research-note">
        <Leaf size={28} />

        <div>
          <h2>{t('home.researchTitle')}</h2>
          <p>{t('home.researchDescription')}</p>
        </div>

        <span>
          {t('home.region')}
          <br />
          {t('home.country')}
        </span>
      </section>

    
    </main>
  )
}