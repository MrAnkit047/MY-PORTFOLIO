import { motion } from "framer-motion"
import { useTiltEffect } from "../hooks/useTiltEffect"
import { useTheme } from "../context/ThemeContext"

const skillGroups = [
  {
    title: 'Frontend Development',
    icon: '⚡',
    skills: [
      { name: 'React.js', level: 90, icon: '⚛️' },
      { name: 'JavaScript (ES6+)', level: 88, icon: '🟨' },
      { name: 'Tailwind CSS', level: 92, icon: '🎨' },
      { name: 'HTML5 / CSS3', level: 95, icon: '🌐' },
    ],
  },
  {
    title: 'Backend & Databases',
    icon: '⚙️',
    skills: [
      { name: 'Node.js & Express', level: 85, icon: '🟢' },
      { name: 'Python & Django', level: 80, icon: '🐍' },
      { name: 'MongoDB', level: 82, icon: '🍃' },
      { name: 'MySQL', level: 84, icon: '🐬' },
    ],
  },
  {
    title: 'Tools & Architecture',
    icon: '🛠️',
    skills: [
      { name: 'Git & GitHub', level: 90, icon: '📦' },
      { name: 'REST APIs', level: 88, icon: '🔌' },
      { name: 'Vite & Webpack', level: 85, icon: '⚡' },
      { name: 'UI/UX & Responsive', level: 94, icon: '📱' },
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const groupVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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

export default function Skills() {
  const { darkMode, accentHex } = useTheme()

  return (
    <motion.section
      id="skills"
      className="mt-16 scroll-mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.div
        variants={groupVariants}
        className={`rounded-3xl border p-6 sm:p-10 transition-colors duration-300 ${
          darkMode
            ? "border-white/10 bg-white/5 shadow-2xl"
            : "border-gray-200 bg-white shadow-lg"
        }`}
      >
        <motion.div
          variants={groupVariants}
          className="flex items-center gap-3.5"
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl font-bold text-white shadow-md"
            style={{ backgroundColor: `${accentHex}33`, color: accentHex, border: `1px solid ${accentHex}44` }}
          >
            🚀
          </span>
          <div>
            <h2 className="text-3xl font-bold font-heading">Skills & Tech Stack</h2>
            <p className={`text-xs ${darkMode ? "text-white/60" : "text-gray-500"}`}>Core Technologies & Proficiency</p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="mt-8 grid gap-6 md:grid-cols-3"
        >
          {skillGroups.map((g) => (
            <motion.div
              key={g.title}
              variants={groupVariants}
            >
              <TiltCard
                className={`card-glow h-full rounded-3xl border p-6 transition-all duration-300 ${
                  darkMode
                    ? "border-white/10 bg-black/40 hover:border-white/20"
                    : "border-gray-200 bg-gray-50/80 hover:border-gray-300 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{g.icon}</span>
                  <p className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-900"}`}>{g.title}</p>
                </div>

                <div className="mt-6 space-y-4">
                  {g.skills.map((s) => (
                    <div key={s.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className={`flex items-center gap-1.5 ${darkMode ? "text-white/85" : "text-gray-700"}`}>
                          <span>{s.icon}</span>
                          <span>{s.name}</span>
                        </span>
                        <span style={{ color: accentHex }}>{s.level}%</span>
                      </div>

                      {/* Animated level bar */}
                      <div className={`h-2 w-full overflow-hidden rounded-full ${darkMode ? "bg-white/10" : "bg-gray-200"}`}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: accentHex }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

