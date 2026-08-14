import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTiltEffect } from "../hooks/useTiltEffect"
import { useTheme } from "../context/ThemeContext"
import { useAppointment } from "../context/AppointmentContext"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

function TiltCard({ children, className }) {
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

export default function Contact() {
  const { darkMode, accentHex } = useTheme()
  const { openAppointmentModal } = useAppointment()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const [copiedKey, setCopiedKey] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setIsSending(true)

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '21c99e86-54d6-425e-8fb1-b06f83f750ea',
          subject: `📬 New Contact Message from ${formData.name}`,
          from_name: 'Ankit Portfolio Contact Form',
          email: formData.email,
          to_email: 'bashyalankit861@gmail.com',
          message: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
        }),
      }).catch(() => {})
    } catch {
      // Ignore
    }

    setIsSending(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 5000)
  }

  const contactItems = [
    { key: 'Email', value: 'bashyalankit861@gmail.com', icon: '✉️' },
    { key: 'Phone', value: '+977-9820689000', icon: '📞' },
    { key: 'GitHub', value: 'github.com/MrAnkit047', icon: '💻', isLink: true, link: 'https://github.com/MrAnkit047' },
    { key: 'Location', value: 'Butwal, Nepal', icon: '📍' },
  ]

  return (
    <motion.section
      id="contact"
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
            📬
          </span>
          <div>
            <h2 className="text-3xl font-bold font-heading">Get In Touch</h2>
            <p className={`text-xs ${darkMode ? "text-white/60" : "text-gray-500"}`}>Let's build something remarkable together</p>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Left Column: Direct info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <p className={`text-base leading-relaxed ${darkMode ? "text-white/80" : "text-gray-700"}`}>
              Have an exciting project, freelance opportunity, or technical question? I'm always open to discussing new opportunities and collaborations.
            </p>

            {/* Direct Appointment Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
              darkMode ? "bg-purple-500/10 border-purple-500/30 text-white" : "bg-purple-50 border-purple-200 text-gray-900"
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <h4 className="text-sm font-bold font-heading">Schedule a 1-on-1 Call</h4>
                  <p className={`text-xs ${darkMode ? "text-white/70" : "text-gray-600"}`}>Book date & time; instant Gmail confirmation</p>
                </div>
              </div>
              <motion.button
                onClick={openAppointmentModal}
                className="shrink-0 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition"
                style={{ backgroundColor: accentHex }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Slot 🚀
              </motion.button>
            </div>


            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3.5 text-sm"
            >
              {contactItems.map((x) => (
                <motion.div key={x.key} variants={itemVariants}>
                  <TiltCard
                    className={`card-glow cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${
                      darkMode
                        ? "border-white/10 bg-black/40 hover:border-white/20"
                        : "border-gray-200 bg-gray-50/80 hover:border-gray-300 shadow-sm"
                    }`}
                  >
                    <div
                      onClick={() => {
                        if (x.isLink) {
                          window.open(x.link, '_blank')
                        } else {
                          handleCopy(x.value, x.key)
                        }
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{x.icon}</span>
                        <div>
                          <p className={`text-xs font-medium ${darkMode ? "text-white/60" : "text-gray-500"}`}>{x.key}</p>
                          <p className={`mt-0.5 font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{x.value}</p>
                        </div>
                      </div>

                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-medium transition"
                        style={{ backgroundColor: `${accentHex}20`, color: accentHex }}
                      >
                        {x.isLink ? "Visit Profile ↗" : copiedKey === x.key ? "✓ Copied!" : "Click to Copy"}
                      </span>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className={`rounded-3xl border p-6 transition-all ${
              darkMode
                ? "border-white/10 bg-black/40"
                : "border-gray-200 bg-gray-50/80 shadow-sm"
            }`}
          >
            <div className="grid gap-4">
              <div>
                <label className={`text-xs font-medium ${darkMode ? "text-white/70" : "text-gray-600"}`}>Your Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/30"
                      : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                  }`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className={`text-xs font-medium ${darkMode ? "text-white/70" : "text-gray-600"}`}>Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/30"
                      : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                  }`}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className={`text-xs font-medium ${darkMode ? "text-white/70" : "text-gray-600"}`}>Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`mt-1.5 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/30"
                      : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                  }`}
                  placeholder="Tell me about your project or inquiry..."
                />
              </div>

              <motion.button
                type="submit"
                className="w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg transition-transform"
                style={{ backgroundColor: accentHex, boxShadow: `0 0 20px ${accentHex}55` }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-xl p-3.5 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                  >
                    ✓ Thank you! Message sent successfully. Ankit will respond shortly.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </motion.section>
  )
}

