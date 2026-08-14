import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"

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

export default function Footer() {
  const { darkMode, accentHex } = useTheme()

  return (
    <motion.footer
      className={`mt-20 border-t transition-colors duration-300 ${
        darkMode ? "border-white/10 bg-black/40 text-white/80" : "border-gray-200 bg-gray-50 text-gray-700"
      }`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-6xl px-4 py-12">
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl font-bold text-white shadow-md font-heading"
              style={{ backgroundColor: accentHex }}
            >
              A
            </span>
            <div>
              <p className={`font-bold font-heading text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>Ankit Bashyal</p>
              <p className={`text-xs ${darkMode ? "text-white/60" : "text-gray-500"}`}>Full-Stack Web Developer & BCA Student</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-medium">
            {[
              { label: 'Home', href: '#home' },
              { label: 'About', href: '#about' },
              { label: 'Skills', href: '#skills' },
              { label: 'Projects', href: '#projects' },
              { label: 'Education', href: '#education' },
              { label: 'Contact', href: '#contact' },
            ].map((link) => (
              <motion.a
                key={link.label}
                className={`transition-colors ${
                  darkMode ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                href={link.href}
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 pt-6 border-t border-white/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
        >
          <p className={darkMode ? "text-white/50" : "text-gray-500"}>
            © {new Date().getFullYear()} Ankit Bashyal. Built with React 18, Vite, Framer Motion & Tailwind CSS.
          </p>
          <p className={darkMode ? "text-white/40" : "text-gray-400"}>
            Crafted with passion from Nepal 🇳🇵
          </p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

