import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'saru-bima-theme'

const LABELS = {
  en: {
    dark: 'Switch to dark mode',
    light: 'Switch to light mode',
  },
  si: {
    dark: 'අඳුරු පෙනුමට මාරු කරන්න',
    light: 'ආලෝකමත් පෙනුමට මාරු කරන්න',
  },
  ta: {
    dark: 'இருண்ட தோற்றத்திற்கு மாறவும்',
    light: 'ஒளிர்ந்த தோற்றத்திற்கு மாறவும்',
  },
}

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  } catch {
    // Use the device preference if storage is unavailable.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export default function ThemeToggle() {
  const { i18n } = useTranslation()
  const [theme, setTheme] = useState(getInitialTheme)

  const isDark = theme === 'dark'
  const language = i18n.resolvedLanguage || 'en'
  const labels = LABELS[language] || LABELS.en
  const label = isDark ? labels.light : labels.dark

  useEffect(() => {
    const root = document.documentElement

    root.dataset.theme = theme

    // Also support components that use the shadcn dark class.
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Theme switching still works without browser storage.
    }
  }, [theme])

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => {
        setTheme(current => current === 'dark' ? 'light' : 'dark')
      }}
      aria-label={label}
      title={label}
    >
      {isDark
        ? <Sun size={20} aria-hidden="true" />
        : <Moon size={20} aria-hidden="true" />}
    </button>
  )
}