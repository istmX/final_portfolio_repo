'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'

type TextHoverEffectProps = {
  text: string
  duration?: number
  automatic?: boolean
}

export function TextHoverEffect({ text, duration = 0, automatic = true }: TextHoverEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const generatedId = useId().replace(/:/g, '')
  const gradientId = `text-gradient-${generatedId}`
  const maskId = `text-mask-${generatedId}`
  const revealId = `text-reveal-${generatedId}`
  const reduceMotion = useReducedMotion()
  const inView = useInView(svgRef, { once: true, amount: 0.25 })
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' })

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !hovered) return

    const bounds = svg.getBoundingClientRect()
    setMaskPosition({
      cx: `${((cursor.x - bounds.left) / bounds.width) * 100}%`,
      cy: `${((cursor.y - bounds.top) / bounds.height) * 100}%`,
    })
  }, [cursor, hovered])

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 600 150"
      role="img"
      aria-label={text}
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(event) => setCursor({ x: event.clientX, y: event.clientY })}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="select-none overflow-visible rounded-sm outline-none"
    >
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="25%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </radialGradient>
        <motion.radialGradient
          id={revealId}
          gradientUnits="userSpaceOnUse"
          r="24%"
          initial={{ cx: '50%', cy: '50%' }}
          animate={maskPosition}
          transition={{ duration, ease: 'easeOut' }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${revealId})`} />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--foreground)"
        className="font-display text-[6.5rem] font-bold tracking-[-0.08em] sm:text-[8rem]"
        style={{ opacity: inView ? 0.12 : 0 }}
      >
        {text}
      </text>
      {automatic && (
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth="0.8"
          stroke="var(--muted)"
          className="fill-transparent font-display text-[6.5rem] font-bold tracking-[-0.08em] sm:text-[8rem]"
          initial={{ strokeDashoffset: 1000, strokeDasharray: 1000, opacity: 0 }}
          animate={inView ? { strokeDashoffset: 0, strokeDasharray: 1000, opacity: 0.38 } : undefined}
          transition={{ duration: reduceMotion ? 0 : 3.5, ease: 'easeInOut' }}
        >
          {text}
        </motion.text>
      )}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.1"
        mask={`url(#${maskId})`}
        className="fill-transparent font-display text-[6.5rem] font-bold tracking-[-0.08em] sm:text-[8rem]"
        style={{ opacity: hovered ? 1 : 0, transition: 'opacity 200ms ease' }}
      >
        {text}
      </text>
      <motion.circle
        cx="548"
        cy="52"
        r="6"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2.5"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.9 } : undefined}
        transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 2.8, ease: 'easeOut' }}
      />
    </svg>
  )
}
