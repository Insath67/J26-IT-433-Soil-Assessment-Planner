import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <label className="language-switcher">
      <span>{t('language')}</span>

      <select
        value={i18n.resolvedLanguage || 'en'}
        onChange={event => {
          void i18n.changeLanguage(event.target.value)
        }}
      >
        <option value="si" lang="si">සිංහල</option>
        <option value="en" lang="en">English</option>
        <option value="ta" lang="ta">தமிழ்</option>
      </select>
    </label>
  )
}