import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

const colorThemes = [
  { name: 'Electric Violet', value: '#7c3aed', css: 'purple' },
  { name: 'Cyber Cyan', value: '#06b6d4', css: 'blue' },
  { name: 'Emerald Neon', value: '#10b981', css: 'green' },
  { name: 'Rose Metallic', value: '#f43f5e', css: 'pink' },
  { name: 'Sunset Amber', value: '#f59e0b', css: 'orange' },
]

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || 'purple'
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor)
    document.documentElement.setAttribute('data-accent', accentColor)
  }, [accentColor])

  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  const currentColor = colorThemes.find((c) => c.css === accentColor) || colorThemes[0]
  const accentHex = currentColor.value

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        accentColor,
        setAccentColor,
        accentHex,
        colorThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

