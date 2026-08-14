import { useRef, useCallback } from 'react'

/**
 * 3D Tilt Effect Hook
 * Applies perspective tilt transformation to a card element on mouse hover.
 *
 * @param {Object} options
 * @param {number} options.maxTilt - Maximum tilt angle in degrees (default: 10)
 * @param {number} options.perspective - CSS perspective value (default: 1000)
 * @param {number} options.scale - Scale on hover (default: 1.02)
 * @param {number} options.speed - Transition speed in ms (default: 300)
 * @param {boolean} options.glassEffect - Whether to apply dynamic glass glare (default: true)
 * @returns {Object} { ref, onMouseEnter, onMouseLeave, onMouseMove, style }
 */
export function useTiltEffect(options = {}) {
  const {
    maxTilt = 10,
    perspective = 1000,
    scale = 1.02,
    speed = 300,
    glassEffect = true,
  } = options

  const ref = useRef(null)
  const glareRef = useRef(null)
  const isHovering = useRef(false)
  const timeoutRef = useRef(null)

  const onMouseEnter = useCallback(() => {
    isHovering.current = true
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const onMouseLeave = useCallback(() => {
    isHovering.current = false
    const el = ref.current
    if (!el) return

    timeoutRef.current = setTimeout(() => {
      el.style.transition = `transform ${speed}ms ease-out`
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }, 50)

    // Reset glare
    if (glassEffect && glareRef.current) {
      glareRef.current.style.opacity = '0'
    }
  }, [perspective, speed, glassEffect])

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el || !isHovering.current) return

      const rect = el.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      // Calculate mouse position relative to card center (range: -1 to 1)
      const mouseX = (e.clientX - rect.left) / width
      const mouseY = (e.clientY - rect.top) / height

      const rotateX = -(mouseY - 0.5) * 2 * maxTilt
      const rotateY = (mouseX - 0.5) * 2 * maxTilt

      el.style.transition = `transform ${50}ms ease-out`
      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`

      // Dynamic glass glare effect
      if (glassEffect && glareRef.current) {
        const glareX = mouseX * 100
        const glareY = mouseY * 100
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
        glareRef.current.style.opacity = '1'
      }
    },
    [maxTilt, perspective, scale, glassEffect]
  )

  const style = glassEffect
    ? { position: 'relative', overflow: 'hidden', transformStyle: 'preserve-3d' }
    : { transformStyle: 'preserve-3d' }

  return {
    ref,
    glareRef,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    style,
  }
}

