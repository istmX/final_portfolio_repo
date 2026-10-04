'use client'

import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

const STROKES = [
  'M13 75C24 63 35 33 45 18C50 10 54 28 59 48C62 61 65 73 69 75C73 77 79 66 84 57M35 57C46 53 58 53 69 56',
  'M82 74C88 63 91 52 96 51C102 50 95 67 101 70C107 73 113 56 119 54C124 53 124 61 121 67C117 77 113 84 118 87C124 91 132 73 137 61C141 51 145 48 149 52',
  'M145 63C149 54 161 52 165 59C169 67 159 75 151 71C145 68 148 58 156 56C164 54 169 62 166 70C164 76 171 73 176 64',
  'M175 74C181 62 184 52 189 52C195 53 186 68 192 71C199 74 205 55 212 54C219 53 211 68 218 71C225 74 235 61 244 54C251 49 253 54 247 62C241 70 234 78 239 82C244 86 252 81 258 76',
  'M14 81C67 87 137 82 201 76C221 74 241 69 255 64',
]

export default function FooterSignature() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.65 })
  const reduceMotion = useReducedMotion()
  const visible = inView || reduceMotion

  return (
    <svg ref={ref} role="img" aria-label="Aryan, handwritten signature" viewBox="0 0 258 96" fill="none" className="h-[58px] w-[156px] overflow-visible text-foreground/85 sm:h-[70px] sm:w-[188px]">
      {STROKES.map((d, index) => (
        <motion.path
          key={d}
          d={d}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={index === 4 ? 1.7 : 2.35}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0.35 }}
          animate={visible ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{
            pathLength: { duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : index * 0.1, ease: [0.45, 0, 0.25, 1] },
            opacity: { duration: reduceMotion ? 0 : 0.28, delay: reduceMotion ? 0 : 0.85 + index * 0.1, ease: 'easeOut' },
          }}
        />
      ))}
    </svg>
  )
}
