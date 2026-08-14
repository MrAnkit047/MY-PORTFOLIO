import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'
import { AppointmentProvider } from './context/AppointmentContext.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Education from './components/Education.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import BackToTop from './components/BackToTop.jsx'
import SectionDivider from './components/SectionDivider.jsx'
import { useCustomCursor } from './hooks/useCustomCursor.js'

function AppContent() {
  const { darkMode, accentHex } = useTheme()

  // Custom cursor glow
  useCustomCursor({ color: accentHex })

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <ScrollProgress />
      <Navbar />

      <main className="relative mx-auto max-w-6xl px-4">
        <Hero />

        <SectionDivider />
        <About />

        <SectionDivider />
        <Skills />

        <SectionDivider />
        <Projects />

        <SectionDivider />
        <Education />

        <SectionDivider />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppointmentProvider>
        <AppContent />
      </AppointmentProvider>
    </ThemeProvider>
  )
}

