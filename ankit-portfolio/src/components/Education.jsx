import { motion } from "framer-motion"
import { useTiltEffect } from "../hooks/useTiltEffect"
import { useTheme } from "../context/ThemeContext"

const timeline = [
  {
    year: '2023 - Present',
    title: 'Bachelor of Computer Application (BCA)',
    org: 'Crimson College of Technology',
    detail: 'Specialization in Software Development, Database Management, Web Technologies, and Algorithms.',
    highlights: ['Core Stack: React, Python, Java, SQL', 'Active in Tech Projects & Software Competitions'],
    status: 'In Progress',
  },
  {
    year: '2020 - 2022',
    title: 'Higher Secondary (+2 Science)',
    org: 'New Horizon College',
    detail: 'Focus on Physics, Mathematics, Chemistry, and Computer Science fundamentals.',
    highlights: ['Graduated with Distinction', 'Strong foundation in Logic & Mathematics'],
    status: 'Completed',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

function TiltCard({ children, className }) {
  const tilt = useTiltEffect({ maxTilt: 6, scale: 1.02, glassEffect: true })

  return (
    <div
      ref={tilt.ref}
      className={className}
      style={tilt.style}
      onMouseEnter={tilt.onMouseEnter}
      onMouseLeave={tilt.onMouseLeave}
      onMouseMove={tilt.onMouseMove}
    >
      {children}
      <div
        ref={tilt.glareRef}
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
      />
    </div>
  )
}

export default function Education() {
  const { darkMode, accentHex } = useTheme()

  return (
    <motion.section
      id="education"
      className="mt-16 scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.div
        variants={cardVariants}
        className={`rounded-3xl border p-6 sm:p-10 transition-colors duration-300 ${
          darkMode
            ? "border-white/10 bg-white/5 shadow-2xl"
            : "border-gray-200 bg-white shadow-lg"
        }`}
      >
        <motion.div
          variants={cardVariants}
          className="flex items-center gap-3.5"
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl font-bold text-white shadow-md"
            style={{ backgroundColor: `${accentHex}33`, color: accentHex, border: `1px solid ${accentHex}44` }}
          >
            🎓
          </span>
          <div>
            <h2 className="text-3xl font-bold font-heading">Education & Background</h2>
            <p className={`text-xs ${darkMode ? "text-white/60" : "text-gray-500"}`}>Academic Journey & Achievements</p>
          </div>
        </motion.div>

        <div className="relative mt-10 pl-4 sm:pl-6 border-l-2" style={{ borderColor: `${accentHex}33` }}>
          <motion.div
            variants={containerVariants}
            className="space-y-8"
          >
            {timeline.map((t) => (
              <motion.div
                key={t.title}
                variants={cardVariants}
                className="relative"
              >
                {/* Timeline node */}
                <motion.span
                  className="absolute -left-[23px] sm:-left-[31px] top-6 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-black"
                  style={{ borderColor: accentHex, backgroundColor: accentHex }}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <TiltCard
                  className={`card-glow rounded-3xl border p-6 transition-all duration-300 ${
                    darkMode
                      ? "border-white/10 bg-black/40 hover:border-white/20"
                      : "border-gray-200 bg-gray-50/80 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: `${accentHex}20`, color: accentHex }}
                    >
                      {t.year}
                    </span>
                    <span className={`text-xs font-medium ${darkMode ? "text-white/50" : "text-gray-400"}`}>{t.status}</span>
                  </div>

                  <h3 className={`mt-3 text-xl font-bold font-heading ${darkMode ? "text-white" : "text-gray-900"}`}>{t.title}</h3>
                  <p className="text-sm font-semibold text-brand-400" style={{ color: accentHex }}>{t.org}</p>
                  <p className={`mt-2 text-sm leading-relaxed ${darkMode ? "text-white/75" : "text-gray-600"}`}>{t.detail}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.highlights.map((h) => (
                      <span
                        key={h}
                        className={`rounded-xl px-3 py-1 text-xs border ${
                          darkMode ? "border-white/10 bg-white/5 text-white/80" : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        • {h}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}

