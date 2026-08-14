import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ThemeSwitcher() {
  const { darkMode, toggleDarkMode, accentColor, setAccentColor, colorThemes, accentHex } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm transition ${
          darkMode
            ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
            : 'border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Theme settings"
      >
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-3.5 w-3.5 rounded-full ring-2 ring-white/30"
            style={{ backgroundColor: accentHex }}
          />
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`absolute right-0 top-full z-50 mt-3 w-60 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                darkMode
                  ? 'border-white/10 bg-gray-900/95 text-white'
                  : 'border-gray-200 bg-white/95 text-gray-900'
              }`}
            >
              <p className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-white/50' : 'text-gray-400'}`}>Mode</p>

              <div className={`mt-2 flex items-center justify-between rounded-xl p-2.5 border ${
                darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'
              }`}>
                <span className="text-xs font-semibold">{darkMode ? 'Dark Appearance' : 'Light Appearance'}</span>
                <button
                  onClick={toggleDarkMode}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                  style={{ backgroundColor: darkMode ? accentHex : '#cbd5e1' }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <p className={`mt-4 text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-white/50' : 'text-gray-400'}`}>Accent Theme</p>

              <div className="mt-2.5 flex items-center justify-between gap-2">
                {colorThemes.map((c) => (
                  <button
                    key={c.css}
                    onClick={() => setAccentColor(c.css)}
                    className={`h-7 w-7 rounded-full transition-all ${
                      accentColor === c.css ? 'ring-2 ring-offset-2 ring-white scale-110 shadow-lg' : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                    aria-label={c.name}
                    title={c.name}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

