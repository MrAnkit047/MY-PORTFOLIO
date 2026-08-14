import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { useAppointment } from "../context/AppointmentContext"
import { useParticleNetwork } from "../hooks/useParticleNetwork"

const techCards = [
  { label: "React", icon: "⚛️", color: "#61DAFB", x: -80, y: -50, rotate: -8, delay: 0.1 },
  { label: "Node.js", icon: "🟢", color: "#339933", x: 85, y: -35, rotate: 5, delay: 0.25 },
  { label: "Tailwind", icon: "🎨", color: "#06B6D4", x: 60, y: 60, rotate: -4, delay: 0.4 },
  { label: "MongoDB", icon: "🍃", color: "#47A248", x: -75, y: 55, rotate: 6, delay: 0.55 },
  { label: "Express", icon: "⚡", color: "#000", x: -100, y: -85, rotate: -6, delay: 0.15 },
  { label: "Python", icon: "🐍", color: "#3776AB", x: 95, y: -80, rotate: 4, delay: 0.35 },
]

const floatingTags = [
  { label: "UI/UX", x: -45, y: -120, delay: 0.2 },
  { label: "API", x: 50, y: -110, delay: 0.5 },
  { label: "Git", x: -55, y: 110, delay: 0.8 },
  { label: "DevOps", x: 60, y: 100, delay: 1.1 },
]

const stats = [
  { value: "+3", label: "Projects" },
  { value: "React", label: "Core Stack" },
  { value: "Git", label: "Best Practices" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function Hero() {
  const { darkMode, accentHex } = useTheme()
  const { openAppointmentModal } = useAppointment()
  const [typingText, setTypingText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [roleIndex, setRoleIndex] = useState(0)
  const canvasRef = useRef(null)

  const roles = [
    "Full-Stack Web Developer.",
    "React & Node.js Specialist.",
    "UI/UX & Web Architect.",
    "BCA Computer Science Student."
  ]

  // Particle network background
  useParticleNetwork(canvasRef, {
    color: accentHex,
    particleCount: 55,
    connectionDistance: 130,
    mouseInfluence: 70,
    speed: 0.4,
  })

  // Multi-phrase typing animation
  useEffect(() => {
    let currentRole = roles[roleIndex]
    let charIndex = 0
    let isDeleting = false
    let timer

    const typeStep = () => {
      if (!isDeleting && charIndex <= currentRole.length) {
        setTypingText(currentRole.substring(0, charIndex))
        charIndex++
        timer = setTimeout(typeStep, 60)
      } else if (isDeleting && charIndex >= 0) {
        setTypingText(currentRole.substring(0, charIndex))
        charIndex--
        timer = setTimeout(typeStep, 30)
      } else if (!isDeleting && charIndex > currentRole.length) {
        timer = setTimeout(() => {
          isDeleting = true
          typeStep()
        }, 1800)
      } else if (isDeleting && charIndex < 0) {
        setRoleIndex((prev) => (prev + 1) % roles.length)
      }
    }

    timer = setTimeout(typeStep, 100)
    return () => clearTimeout(timer)
  }, [roleIndex])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <section id="home" className="relative mt-10 scroll-mt-24">
      {/* Particle Network Canvas Background */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity: 0.65 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-10 transition-colors duration-300 ${
          darkMode
            ? "border-white/10 bg-gradient-to-b from-brand-500/10 via-black to-black shadow-2xl"
            : "border-gray-200 bg-gradient-to-b from-brand-500/5 via-white to-white shadow-xl"
        }`}
      >
        <div className={`pointer-events-none absolute inset-0 bg-grid ${darkMode ? "opacity-30" : "opacity-20"}`} />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: accentHex }} />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: accentHex }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full opacity-[0.04] blur-[120px]" style={{ backgroundColor: accentHex }} />

        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* LEFT - Content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.p
              variants={itemVariants}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                darkMode ? "border-white/10 bg-white/5 text-white/90" : "border-gray-200 bg-white text-gray-700 shadow-sm"
              }`}
            >
              <motion.span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: accentHex }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Available for Freelance & Full-time Roles</span>
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className={`mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl font-heading ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              Hi, I'm <span style={{ color: accentHex }}>Ankit Bashyal</span>.<br />
              <span className="gradient-text min-h-[1.2em] inline-block">{typingText}</span>
              <span className={`text-3xl ${showCursor ? "opacity-100" : "opacity-0"}`} style={{ color: accentHex }}>|</span>
            </motion.h1>

            <motion.p variants={itemVariants} className={`mt-4 max-w-xl text-base leading-relaxed ${darkMode ? "text-white/75" : "text-gray-600"}`}>
              Full-Stack Developer passionate about crafting modern, responsive web applications with React, Node.js, and clean software architecture.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-7 flex flex-wrap gap-3.5">
              <motion.button
                onClick={openAppointmentModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform"
                style={{ backgroundColor: accentHex, boxShadow: `0 0 25px ${accentHex}55` }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 35px ${accentHex}88` }}
                whileTap={{ scale: 0.95 }}
              >
                <span>📅 Book Call</span>
              </motion.button>

              <motion.a
                href="#projects"
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold transition ${
                  darkMode
                    ? "border-white/10 bg-white/5 text-white/90 hover:bg-white/10"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View Projects</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>

              <motion.a
                href="#contact"
                className={`inline-flex items-center justify-center rounded-xl border px-6 py-3.5 text-sm font-semibold transition ${
                  darkMode
                    ? "border-white/10 bg-white/5 text-white/90 hover:bg-white/10"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.a>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`mt-7 flex flex-wrap items-center gap-5 text-sm ${darkMode ? "text-white/70" : "text-gray-500"}`}
            >
              {stats.map((s) => (
                <motion.div key={s.label} variants={statVariants}>
                  <p className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>{s.value}</p>
                  <p>{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT - True 3D Orbital Revolving Showcase System */}
          <motion.div
            className="flex items-center justify-center relative min-h-[440px] w-full max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Background Ambient Radial Glow */}
            <div
              className="absolute h-80 w-80 rounded-full opacity-30 blur-3xl pointer-events-none transition-colors duration-500"
              style={{
                background: `radial-gradient(circle, ${accentHex} 0%, transparent 70%)`,
              }}
            />

            {/* Orbital Ring Guide Line */}
            <div
              className="absolute h-[340px] w-[340px] sm:h-[370px] sm:w-[370px] rounded-full border border-dashed pointer-events-none opacity-40"
              style={{ borderColor: `${accentHex}66` }}
            />
            <div
              className="absolute h-[240px] w-[240px] rounded-full border border-white/5 pointer-events-none opacity-20"
            />

            {/* Revolving Orbital Tech Satellites Container */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              {[
                { label: "React", icon: "⚛️", color: "#61DAFB" },
                { label: "Node.js", icon: "🟢", color: "#339933" },
                { label: "Tailwind", icon: "🎨", color: "#06B6D4" },
                { label: "Python", icon: "🐍", color: "#3776AB" },
                { label: "Express", icon: "⚡", color: "#f59e0b" },
                { label: "MongoDB", icon: "🍃", color: "#47A248" },
              ].map((item, index, arr) => {
                const angle = (index * 360) / arr.length
                const radius = 170 // orbital distance radius in px
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius

                return (
                  <div
                    key={item.label}
                    className="absolute pointer-events-auto"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    {/* Counter-rotation to keep badges upright and readable */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                      whileHover={{ scale: 1.2, zIndex: 40 }}
                      className={`flex items-center gap-2 rounded-xl px-3 py-1.5 backdrop-blur-xl border shadow-xl cursor-pointer transition-colors ${
                        darkMode
                          ? "bg-black/80 border-white/15 text-white"
                          : "bg-white/95 border-gray-200 text-gray-900"
                      }`}
                      style={{ boxShadow: `0 0 20px ${item.color}35` }}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-xs font-bold tracking-tight">{item.label}</span>
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    </motion.div>
                  </div>
                )
              })}
            </motion.div>

            {/* Centerpiece Profile Card (Stationary Center) */}
            <motion.div
              className={`relative z-20 flex flex-col items-center text-center rounded-3xl border p-6 backdrop-blur-2xl shadow-2xl transition-all ${
                darkMode
                  ? "border-white/15 bg-black/85 text-white"
                  : "border-gray-200 bg-white/90 text-gray-900"
              }`}
              style={{
                boxShadow: `0 15px 40px ${accentHex}25, inset 0 1px 1px rgba(255,255,255,0.15)`,
                maxWidth: '260px',
              }}
              whileHover={{ scale: 1.04 }}
            >
              {/* Avatar with Animated Glow Ring */}
              <motion.div
                className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full ring-4"
                style={{ ringColor: `${accentHex}66` }}
                animate={{ boxShadow: [`0 0 15px ${accentHex}33`, `0 0 30px ${accentHex}55`, `0 0 15px ${accentHex}33`] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <img
                  src="/profile.jpg"
                  alt="Ankit Bashyal"
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none" }}
                />
                <span
                  className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-black"
                  style={{ backgroundColor: "#22c55e" }}
                  title="Online"
                />
              </motion.div>

              <h3 className="mt-3 text-lg font-extrabold tracking-tight font-heading">
                Ankit Bashyal
              </h3>
              <p className={`mt-0.5 text-[11px] font-medium ${darkMode ? "text-white/60" : "text-gray-500"}`}>
                Full-Stack Web Developer
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Available for Work 🟢</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
