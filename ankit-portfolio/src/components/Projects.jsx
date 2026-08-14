import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTiltEffect } from "../hooks/useTiltEffect"
import { useTheme } from "../context/ThemeContext"

const projects = [
  {
    id: 1,
    title: 'BUYSMART',
    subtitle: 'E-Commerce & Price Monitoring Engine',
    category: 'Full-Stack',
    description: 'Smart e-commerce platform featuring real-time price monitoring, deal notifications, product catalog search, and cart state management.',
    detailedDescription: 'Full-stack commercial web application built with React, Node.js, Express, and MongoDB. Features real-time price tracking, automated deal comparison, JWT user authentication, shopping cart state management, and responsive UI layout tailored for high conversion.',
    highlights: ['⚡ Real-Time Price Sync', '🛒 Dynamic Shopping Cart', '🔐 JWT Auth & Security'],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST API'],
    icon: '🛍️',
    github: 'https://github.com/MrAnkit047/BUYSMART',
    demo: 'https://github.com/MrAnkit047/BUYSMART',
    featured: true,
  },
  {
    id: 2,
    title: 'BOOKMYARENA',
    subtitle: 'Turf & Sports Venue Reservation System',
    category: 'Full-Stack',
    description: 'Real-time sports arena & turf slot booking web platform allowing users to inspect available time slots and reserve online.',
    detailedDescription: 'Full-stack slot reservation platform engineered with React, Node.js, Express, and Database architecture. Features an interactive date/time calendar scheduler, arena availability tracking, customer booking management, and secure API endpoints.',
    highlights: ['⚽ Calendar Slot Scheduler', '📅 Real-Time Availability', '📊 Admin Dashboard'],
    tags: ['React', 'Node.js', 'Express', 'MongoDB/MySQL', 'Tailwind CSS'],
    icon: '⚽',
    github: 'https://github.com/MrAnkit047/BOOKMYARENA',
    demo: 'https://github.com/MrAnkit047/BOOKMYARENA',
    featured: true,
  },
  {
    id: 3,
    title: 'SMART COLLEGE ERP',
    subtitle: 'Student & Faculty Management System',
    category: 'Backend & APIs',
    description: 'Comprehensive academic ERP platform managing student records, faculty courses, attendance, grades, and role-based permissions.',
    detailedDescription: 'Enterprise-grade educational institution management system built with Python, Django REST Framework, JavaScript, and MySQL database. Provides fine-grained role-based access control (Admin, Faculty, Student), automated grade calculation, attendance logs, and report exports.',
    highlights: ['🔒 Role-Based Access Control', '🎓 Student Grade Analytics', '📜 Django REST API'],
    tags: ['Python', 'Django REST', 'JavaScript', 'MySQL', 'Bootstrap'],
    icon: '🎓',
    github: 'https://github.com/MrAnkit047/smart-college-management-system-',
    demo: 'https://github.com/MrAnkit047/smart-college-management-system-',
    featured: true,
  },
  {
    id: 4,
    title: 'STREETRIDE RENTALS',
    subtitle: 'Mobility & Vehicle Booking Engine',
    category: 'Full-Stack',
    description: 'On-demand vehicle rental platform for booking bikes and cars with automated duration rate estimation and instant reservations.',
    detailedDescription: 'Full-stack rental management web application built with JavaScript, Node.js, Express, and HTML5/CSS3. Includes multi-vehicle catalog search, daily/hourly rate estimation, reservation management, and responsive customer interface.',
    highlights: ['🚗 Vehicle Fleet Catalog', '⏱️ Dynamic Rental Calculator', '🚀 Express REST Engine'],
    tags: ['JavaScript', 'Node.js', 'Express', 'HTML5/CSS3', 'REST API'],
    icon: '🚗',
    github: 'https://github.com/MrAnkit047/STREETRIDE-VEHICLE-RENTALS-final',
    demo: 'https://github.com/MrAnkit047/STREETRIDE-VEHICLE-RENTALS-final',
    featured: false,
  },
]

const categories = ['All', 'Full-Stack', 'Backend & APIs']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
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

export default function Projects() {
  const { darkMode, accentHex } = useTheme()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <motion.section
      id="projects"
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
            ? "border-white/10 bg-gradient-to-b from-white/5 via-black/40 to-black/80 shadow-2xl"
            : "border-gray-200 bg-white shadow-xl"
        }`}
      >
        {/* Section Header & Category Filters */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <motion.div variants={cardVariants} className="flex items-center gap-3.5">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg shrink-0"
              style={{ backgroundColor: `${accentHex}33`, color: accentHex, border: `1px solid ${accentHex}44` }}
            >
              💻
            </span>
            <div>
              <h2 className="text-3xl font-bold font-heading tracking-tight">Featured Projects</h2>
              <p className={`text-xs font-medium ${darkMode ? "text-white/60" : "text-gray-500"}`}>
                Full-Stack Systems, Web Apps & REST APIs
              </p>
            </div>
          </motion.div>

          {/* Category Filter Pills */}
          <motion.div variants={cardVariants} className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "text-white shadow-md"
                      : darkMode
                        ? "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                  style={isActive ? { backgroundColor: accentHex } : {}}
                >
                  {cat}
                </button>
              )
            })}
          </motion.div>
        </div>

        {/* Project Cards Grid */}
        <motion.div
          layout
          variants={containerVariants}
          className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p) => (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.93, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                whileHover={{ y: -5 }}
              >
                <TiltCard
                  className={`card-glow group flex h-full flex-col justify-between rounded-3xl border p-6 transition-all duration-300 ${
                    darkMode
                      ? "border-white/10 bg-black/50 hover:border-white/25 shadow-xl hover:shadow-2xl"
                      : "border-gray-200 bg-gray-50/90 hover:border-gray-300 shadow-md hover:shadow-lg"
                  }`}
                >
                  <div>
                    {/* Visual Card Header */}
                    <div
                      className="mb-5 flex h-36 w-full items-center justify-center rounded-2xl relative overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${accentHex}25 0%, ${accentHex}08 70%, transparent 100%)`,
                      }}
                    >
                      <motion.span
                        className="text-5xl transition-transform duration-300 group-hover:scale-110"
                        whileHover={{ rotate: 10 }}
                      >
                        {p.icon}
                      </motion.span>
                      
                      {p.featured && (
                        <span
                          className="absolute top-3 right-3 rounded-full px-3 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md backdrop-blur-md"
                          style={{ backgroundColor: accentHex }}
                        >
                          Featured Project
                        </span>
                      )}

                      <span className={`absolute bottom-3 left-3 text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                        darkMode ? 'bg-black/60 border-white/10 text-white/80' : 'bg-white/80 border-gray-200 text-gray-700'
                      }`}>
                        {p.category}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className={`text-2xl font-bold font-heading tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {p.title}
                      </h3>
                      <p className="text-xs font-semibold" style={{ color: accentHex }}>
                        {p.subtitle}
                      </p>
                    </div>

                    <p className={`mt-3 text-xs leading-relaxed ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                      {p.description}
                    </p>

                    {/* Feature Highlights Pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.highlights.map((h) => (
                        <span
                          key={h}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border ${
                            darkMode ? 'bg-white/5 border-white/10 text-white/90' : 'bg-white border-gray-200 text-gray-800 shadow-xs'
                          }`}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-medium border"
                          style={{
                            backgroundColor: `${accentHex}15`,
                            borderColor: `${accentHex}35`,
                            color: darkMode ? '#f3f4f6' : '#1f2937',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-white/10">
                      <button
                        onClick={() => setSelectedProject(p)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold transition hover:underline"
                        style={{ color: accentHex }}
                      >
                        <span>View Architecture & Specs</span>
                        <span>→</span>
                      </button>

                      <a
                        href={p.github}
                        target="_blank"
                        rel="noreferrer"
                        className={`rounded-xl p-2.5 transition border ${
                          darkMode
                            ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                        title="GitHub Repository"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Project Specs Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ${
                darkMode ? "border-white/15 bg-slate-950 text-white" : "border-gray-200 bg-white text-gray-900"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl font-bold shadow-md shrink-0"
                    style={{ backgroundColor: `${accentHex}25`, color: accentHex, border: `1px solid ${accentHex}44` }}
                  >
                    {selectedProject.icon}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold font-heading">{selectedProject.title}</h3>
                    <p className="text-xs font-semibold" style={{ color: accentHex }}>{selectedProject.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className={`rounded-full p-2 text-xs font-bold transition ${
                    darkMode ? "bg-white/10 hover:bg-white/20 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-4 text-xs sm:text-sm leading-relaxed">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-1.5 opacity-70">Architecture Overview</h4>
                  <p className={darkMode ? "text-white/80" : "text-gray-700"}>{selectedProject.detailedDescription}</p>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-2 opacity-70">Key System Modules</h4>
                  <div className="space-y-1.5 font-mono text-xs">
                    {selectedProject.highlights.map((h) => (
                      <div key={h} className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                        darkMode ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-gray-50 border-gray-200 text-emerald-700'
                      }`}>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-2 opacity-70">Technologies & Frameworks</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-xl px-3 py-1 text-xs font-semibold border"
                        style={{ backgroundColor: `${accentHex}20`, borderColor: `${accentHex}40`, color: accentHex }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3 pt-2">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-lg transition"
                  style={{ backgroundColor: accentHex }}
                >
                  <span>Explore GitHub Code</span>
                  <span>↗</span>
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  className={`rounded-xl border px-5 py-3 text-xs font-semibold ${
                    darkMode ? "border-white/15 bg-white/5 hover:bg-white/10 text-white" : "border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
