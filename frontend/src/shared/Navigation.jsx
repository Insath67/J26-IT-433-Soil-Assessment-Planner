import { NavLink, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { modules } from './modules'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const { t } = useTranslation()

  return (
    <header className="site-header">
      <Link
        className="site-brand"
        to="/"
        aria-label={`Saru Bima — ${t('nav.home')}`}
      >
        <span className="site-brand-icon">
          <Leaf size={25} aria-hidden="true" />
        </span>

        <span className="brand-wordmark">
          <span className="brand-si" lang="si">
            සරු බිම
          </span>

          <span className="brand-en" lang="en">
            SARU BIMA
          </span>
        </span>
      </Link>

      <nav
        aria-label={t('home.explore')}
        className="site-nav"
      >
        <NavLink end to="/">
          {t('nav.home')}
        </NavLink>

        {modules.map(module => (
          <NavLink
            key={module.slug}
            to={`/${module.slug}`}
          >
            {t(`nav.${module.slug}`)}
          </NavLink>
        ))}
      </nav>
<div className="header-controls">
  <LanguageSwitcher />
  <ThemeToggle />
</div>
      
    </header>
  )
}