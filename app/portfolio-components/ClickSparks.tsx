'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type Spark = {
  id: number
  x: number
  y: number
  offsetX: number
  offsetY: number
  size: number
  delay: number
  rotation: number
  shape: 'ring' | 'star' | 'square' | 'dot'
}

function ClickSparks() {
  const [sparks, setSparks] = useState<Spark[]>([])
  const nextId = useRef(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (event.button !== 0) return

      const burstId = nextId.current++
      const glints = Array.from({ length: 5 }, (_, index): Spark => {
        const angle = Math.random() * Math.PI * 2
        const distance = 14 + Math.random() * 30
        const shape: Spark['shape'] =
          Math.random() > 0.48 ? 'star' : Math.random() > 0.5 ? 'square' : 'dot'

        return {
          id: burstId * 6 + index + 1,
          x: event.clientX,
          y: event.clientY,
          offsetX: Math.cos(angle) * distance,
          offsetY: Math.sin(angle) * distance,
          size:
            shape === 'star' ? 7 + Math.random() * 3 : 2 + Math.random() * 2,
          delay: Math.random() * 0.06,
          rotation: Math.random() * 90 - 45,
          shape,
        }
      })
      const ring: Spark = {
        id: burstId * 6,
        x: event.clientX,
        y: event.clientY,
        offsetX: 0,
        offsetY: 0,
        size: 58,
        delay: 0,
        rotation: 0,
        shape: 'ring',
      }
      const burst = [ring, ...glints]

      setSparks((current) => [...current.slice(-59), ...burst])
      window.setTimeout(() => {
        setSparks((current) =>
          current.filter(
            (spark) => spark.id < burstId * 6 || spark.id >= burstId * 6 + 6,
          ),
        )
      }, 750)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    >
      {sparks.map((spark) => (
        <motion.span
          key={spark.id}
          className="text-foreground absolute block"
          style={{
            left: spark.x,
            top: spark.y,
            width: spark.size,
            height: spark.size,
            marginLeft: -spark.size / 2,
            marginTop: -spark.size / 2,
          }}
          initial={{
            opacity: 0,
            scale: spark.shape === 'ring' ? 0.4 : 0.25,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: spark.shape === 'ring' ? [0, 0.55, 0] : [0, 0.9, 0],
            scale: spark.shape === 'ring' ? [0.4, 1.15, 1.35] : [0.25, 1, 0.35],
            rotate: spark.rotation,
            x: spark.shape === 'ring' || shouldReduceMotion ? 0 : spark.offsetX,
            y: spark.shape === 'ring' || shouldReduceMotion ? 0 : spark.offsetY,
          }}
          transition={{ duration: 0.62, delay: spark.delay, ease: 'easeOut' }}
        >
          {spark.shape === 'ring' ? (
            <svg
              viewBox="0 0 100 100"
              className="size-full"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="50" cy="50" r="39" opacity=".8" />
              <circle
                cx="50"
                cy="50"
                r="30"
                strokeDasharray="1 5"
                opacity=".55"
              />
              {Array.from({ length: 16 }, (_, index) => (
                <path
                  key={index}
                  d="M50 5v7"
                  transform={`rotate(${index * 22.5} 50 50)`}
                  strokeLinecap="round"
                  opacity={index % 2 === 0 ? 0.8 : 0.45}
                />
              ))}
            </svg>
          ) : spark.shape === 'star' ? (
            <svg viewBox="0 0 24 24" className="size-full" fill="currentColor">
              <path d="M12 0C13.6 8.5 15.5 10.4 24 12 15.5 13.6 13.6 15.5 12 24 10.4 15.5 8.5 13.6 0 12 8.5 10.4 10.4 8.5 12 0Z" />
            </svg>
          ) : (
            <span
              className={`block size-full bg-current ${spark.shape === 'dot' ? 'rounded-full' : 'rounded-[1px]'}`}
            />
          )}
        </motion.span>
      ))}
    </div>
  )
}

export default ClickSparks
