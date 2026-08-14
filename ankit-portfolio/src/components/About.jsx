import { motion } from "framer-motion"
import { useTiltEffect } from "../hooks/useTiltEffect"
import { useTheme } from "../context/ThemeContext"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const cardVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

function TiltCard({ children, className, accentHex }) {
  const tilt = useTiltEffect({ maxTilt: 8, scale: 1.03, glassEffect: true })

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
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
      />
    </div>
  )
}

export default function About() {
  const { darkMode, accentHex } = useTheme()

  const highlights = [
    { label: 'Location', value: 'Butwal, Nepal', icon: '📍' },
    { label: 'Degree', value: 'BCA (Computer App)', icon: '🎓' },
    { label: 'Focus', value: 'Full-Stack Web Dev', icon: '⚡' },
    { label: 'Stack', value: 'React, Node, Python', icon: '🛠️' },
  ]

  return (
    <motion.section
      id="about"
      className="mt-16 scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.div
        variants={itemVariants}
        className={`rounded-3xl border p-6 sm:p-10 transition-colors duration-300 ${
          darkMode
            ? "border-white/10 bg-white/5 shadow-2xl"
            : "border-gray-200 bg-white shadow-lg"
        }`}
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3.5"
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl font-bold text-white shadow-md"
            style={{ backgroundColor: `${accentHex}33`, color: accentHex, border: `1px solid ${accentHex}44` }}
          >
            👨‍💻
          </span>
          <div>
            <h2 className="text-3xl font-bold font-heading">About Me</h2>
            <p className={`text-xs ${darkMode ? "text-white/60" : "text-gray-500"}`}>Passion, Code & Continuous Growth</p>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-4 text-base leading-relaxed"
          >
            <p className={darkMode ? "text-white/80" : "text-gray-700"}>
              Hi, I'm <strong className="font-semibold" style={{ color: accentHex }}>Ankit Bashyal</strong> — a Bachelor of Computer Application (BCA) student and an ambitious Full-Stack Web Developer based in Nepal. I specialize in designing and engineering high-performance, modern, responsive web applications.
            </p>
            <p className={darkMode ? "text-white/75" : "text-gray-600"}>
              My technical expertise spans <span className="font-medium text-white/90">React, JavaScript, Python, Django, Node.js, Express, MongoDB, and MySQL</span>. I thrive on translating creative concepts into real-world software products with intuitive user experiences and clean back-end architecture.
            </p>
            <p className={darkMode ? "text-white/75" : "text-gray-600"}>
              Beyond writing code, I am deeply committed to continuous learning, exploring open-source tools, and mastering modern frameworks. My objective is to build innovative digital solutions that deliver meaningful real-world impact.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              {['Clean Architecture', 'Responsive UI', 'REST APIs', 'Database Optimization', 'Git Version Control'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full px-3 py-1 text-xs font-medium border"
                  style={{
                    backgroundColor: `${accentHex}15`,
                    borderColor: `${accentHex}33`,
                    color: darkMode ? '#ffffff' : '#111827',
                  }}
                >
                  ✓ {chip}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
          >
            {highlights.map((item) => (
              <motion.div key={item.label} variants={cardVariants}>
                <TiltCard
                  accentHex={accentHex}
                  className={`card-glow rounded-2xl border p-4.5 transition-all duration-300 ${
                    darkMode
                      ? "border-white/10 bg-black/40 hover:border-white/20"
                      : "border-gray-200 bg-gray-50/80 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-medium ${darkMode ? "text-white/60" : "text-gray-500"}`}>{item.label}</p>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <p className={`mt-1.5 text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{item.value}</p>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}

