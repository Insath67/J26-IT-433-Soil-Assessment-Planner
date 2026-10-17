import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import si from './locales/si.json'
import ta from './locales/ta.json'
import cropFinder from '../features/crop-finder/translations'

const supportedLanguages = ['en', 'si', 'ta']
const storageKey = 'saru-bima-language'

function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(storageKey)
    return supportedLanguages.includes(saved) ? saved : 'en'
  } catch {
    return 'en'
  }
}

function applyLanguage(language) {
  const selected = supportedLanguages.includes(language)
    ? language
    : 'en'

  document.documentElement.lang = selected
  document.documentElement.dir = 'ltr'

  try {
    localStorage.setItem(storageKey, selected)
  } catch {
    // Language switching still works if browser storage is unavailable.
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
      cropFinder: cropFinder.en,
    },
    si: {
      translation: si,
      cropFinder: cropFinder.si,
    },
    ta: {
      translation: ta,
      cropFinder: cropFinder.ta,
    },
  },

  defaultNS: 'translation',
  lng: getSavedLanguage(),
  fallbackLng: 'en',
  supportedLngs: supportedLanguages,

  interpolation: {
    escapeValue: false,
  },
})

applyLanguage(i18n.language)
i18n.on('languageChanged', applyLanguage)

export default i18n