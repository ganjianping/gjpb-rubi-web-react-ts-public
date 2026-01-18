import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeColor = 'blue' | 'green' | 'purple' | 'orange'

interface UIContextType {
  theme: Theme
  themeColor: ThemeColor
  toggleTheme: () => void
  setThemeColor: (color: ThemeColor) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as Theme) || 'light'
  })

  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem('themeColor')
    return (saved as ThemeColor) || 'blue'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor)
    document.documentElement.setAttribute('data-theme-color', themeColor)
  }, [themeColor])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color)
  }

  return (
    <UIContext.Provider value={{ theme, themeColor, toggleTheme, setThemeColor }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
