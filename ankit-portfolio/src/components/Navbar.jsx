import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeSwitcher from './ThemeSwitcher.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAppointment } from '../context/AppointmentContext.jsx'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
]

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const { darkMode, accentHex } = useTheme()
  const { openAppointmentModal } = useAppointment()

  useEffect(() => {
    const ids = links.map((l) => l.href.replace('#', ''))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0]
        if (visible?.target?.id) setActive(visible.target.id)
      },
      { root: null, threshold: [0.2, 0.35, 0.5] },
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const bgClass = darkMode ? 'bg-black/80 border-white/10' : 'bg-white/90 border-gray-200'
  const textClass = darkMode ? 'text-white/80' : 'text-gray-700'

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${bgClass}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <motion.a
          href="#home"
          className="flex items-center gap-2.5 font-bold tracking-wide text-base font-heading"
          whileHover={{ scale: 1.02 }}
        >
          <motion.span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl font-bold text-white shadow-md"
            style={{ backgroundColor: accentHex, boxShadow: `0 0 15px ${accentHex}55` }}
            whileHover={{ rotate: 12 }}
          >
            A
          </motion.span>
          <span className={`hidden sm:inline ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ankit Bashyal</span>
        </motion.a>

        <div className="flex items-center gap-3">
          <nav className="hidden md:block">
            <ul className={`flex items-center gap-7 text-sm font-medium ${textClass}`}>
              {links.map((l) => {
                const id = l.href.replace('#', '')
                const isActive = active === id
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className={`relative transition-colors ${
                        darkMode
                          ? isActive ? 'text-white font-semibold' : 'hover:text-white'
                          : isActive ? 'text-gray-900 font-semibold' : 'hover:text-gray-900'
                      }`}
                    >
                      {l.label}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          className="absolute -bottom-2 left-0 h-[2.5px] w-full rounded-full"
                          style={{ backgroundColor: accentHex, boxShadow: `0 0 10px ${accentHex}` }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <ThemeSwitcher />

          <motion.a
            href="https://github.com/MrAnkit047"
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              darkMode
                ? 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10'
                : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="MrAnkit047 GitHub Profile"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </motion.a>

          <motion.button
            onClick={openAppointmentModal}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white shadow-md transition"
            style={{ backgroundColor: accentHex }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Book Meeting</span>
            <span>📅</span>
          </motion.button>

          <motion.button
            className={`inline-flex items-center justify-center rounded-xl border ${
              darkMode ? 'border-white/10 bg-white/5 text-white/90' : 'border-gray-200 bg-gray-100 text-gray-700'
            } px-3 py-2 text-sm md:hidden`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <span>{open ? 'Close' : 'Menu'}</span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="mx-auto max-w-6xl px-4 pb-4">
              <ul className={`flex flex-col gap-2 rounded-2xl border ${
                darkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
              } p-3`}>
                {links.map((l, i) => {
                  const id = l.href.replace('#', '')
                  const isActive = active === id
                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-brand-500/20 text-white'
                            : darkMode
                              ? 'text-white/80 hover:text-white'
                              : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {l.label}
                      </a>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

