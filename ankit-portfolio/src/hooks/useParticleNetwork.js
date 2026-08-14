import { useEffect, useRef } from 'react'

/**
 * Interactive Particle Network Canvas
 * Draws floating particles connected by glowing lines.
 * Particles react to mouse position.
 */
export function useParticleNetwork(canvasRef, options = {}) {
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const animFrameRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let dpr = 1

    const {
      color = '#8b5cf6',
      particleCount = 60,
      connectionDistance = 120,
      particleSize = 2,
      mouseInfluence = 50,
      speed = 0.3,
    } = options

    const hexToRgb = (hex) => {
      const c = hex.replace('#', '')
      const bigint = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16) || 0x8b5cf6
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
    }
    const { r, g, b } = hexToRgb(color)

    function resize() {
      dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }

    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * speed
        this.vy = (Math.random() - 0.5) * speed
        this.size = Math.random() * particleSize + 1
        this.opacity = Math.random() * 0.5 + 0.3
      }

      update() {
        // Mouse interaction
        if (mouseRef.current.active) {
          const dx = this.x - mouseRef.current.x
          const dy = this.y - mouseRef.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouseInfluence * 2) {
            const force = (mouseInfluence * 2 - dist) / (mouseInfluence * 2)
            this.vx += (dx / dist) * force * 0.5
            this.vy += (dy / dist) * force * 0.5
          }
        }

        this.x += this.vx
        this.y += this.vy

        // Damping
        this.vx *= 0.99
        this.vy *= 0.99

        // Wrap around edges
        if (this.x < -50) this.x = width + 50
        if (this.x > width + 50) this.x = -50
        if (this.y < -50) this.y = height + 50
        if (this.y > height + 50) this.y = -50
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`
        ctx.fill()
      }
    }

    function initParticles() {
      particlesRef.current = Array.from({ length: particleCount }, () => new Particle())
    }

    function drawConnections() {
      const particles = particlesRef.current
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.35
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)

      const particles = particlesRef.current
      particles.forEach((p) => {
        p.update()
        p.draw()
      })

      drawConnections()

      // Draw connections to mouse
      if (mouseRef.current.active) {
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        particles.forEach((p) => {
          const dx = p.x - mx
          const dy = p.y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mx, my)
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })

        // Glow at mouse
        const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, 40)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.25)`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.beginPath()
        ctx.arc(mx, my, 40, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    function handleMouseMove(e) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }

    function handleMouseLeave() {
      mouseRef.current.active = false
    }

    function handleResize() {
      resize()
      initParticles()
    }

    resize()
    initParticles()
    animate()

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [canvasRef, options.color, options.particleCount, options.connectionDistance, options.particleSize, options.mouseInfluence, options.speed])
}

