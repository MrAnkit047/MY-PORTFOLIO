import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function SectionDivider() {
  const { accentHex } = useTheme()

  return (
    <div className="relative mx-auto mt-14 flex items-center justify-center">
      {/* Glowing line */}
      <motion.div
        className="relative h-px w-full max-w-3xl"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentHex}22 20%, ${accentHex}44 50%, ${accentHex}22 80%, transparent 100%)`,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Center diamond */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rotate-45"
          style={{ backgroundColor: accentHex, boxShadow: `0 0 12px ${accentHex}66` }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          whileInView={{ scale: 1, opacity: 1, rotate: 45 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        />

        {/* Orbiting dots */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 120, 240].map((angle) => (
            <motion.div
              key={angle}
              className="absolute h-1 w-1 rounded-full"
              style={{
                backgroundColor: accentHex,
                left: `${Math.cos((angle * Math.PI) / 180) * 16}px`,
                top: `${Math.sin((angle * Math.PI) / 180) * 16}px`,
                opacity: 0.6,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

