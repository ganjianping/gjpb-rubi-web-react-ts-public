import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchAppSettings } from '@/shared/data/publicApi'
import type { AppSetting } from '@/shared/data/types'

type Language = 'EN' | 'ZH'

interface AppSettingsContextType {
  settings: AppSetting[]
  language: Language
  setLanguage: (lang: Language) => void
  getSettingValue: (name: string) => string | undefined
  isLoading: boolean
  error: Error | null
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined)

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSetting[]>([])
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved as Language) || 'EN'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        const data = await fetchAppSettings()
        setSettings(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load settings'))
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const getSettingValue = (name: string): string | undefined => {
    const setting = settings.find(s => s.name === name && s.lang === language)
    return setting?.value
  }

  return (
    <AppSettingsContext.Provider 
      value={{ 
        settings, 
        language, 
        setLanguage, 
        getSettingValue, 
        isLoading, 
        error 
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  )
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext)
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider')
  }
  return context
}
