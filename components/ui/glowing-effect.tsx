'use client'

import { animate } from 'motion/react'
import { memo, useCallback, useEffect, useRef, type CSSProperties } from 'react'

type GlowingEffectProps = {
  blur?: number
  inactiveZone?: number
  proximity?: number
  spread?: number
  glow?: boolean
  className?: string
  disabled?: boolean
  movementDuration?: number
  borderWidth?: number
}

const GlowingEffect = memo(function GlowingEffect({
  blur = 0,
  inactiveZone = 0.55,
  proximity = 48,
  spread = 30,
  glow = false,
  className = '',
  disabled = true,
  movementDuration = 0.45,
  borderWidth = 1,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastPosition = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>(0)
  const animationRef = useRef<{ stop: () => void } | null>(null)

  const handleMove = useCallback((event?: PointerEvent) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)

    animationFrameRef.current = requestAnimationFrame(() => {
      const element = containerRef.current
      if (!element) return

      const { left, top, width, height } = element.getBoundingClientRect()
      const mouseX = event?.clientX ?? lastPosition.current.x
      const mouseY = event?.clientY ?? lastPosition.current.y
      if (event) lastPosition.current = { x: mouseX, y: mouseY }

      const centerX = left + width / 2
      const centerY = top + height / 2
      const distance = Math.hypot(mouseX - centerX, mouseY - centerY)
      const inactiveRadius = Math.min(width, height) * inactiveZone * 0.5
      const isActive =
        distance >= inactiveRadius &&
        mouseX >= left - proximity && mouseX <= left + width + proximity &&
        mouseY >= top - proximity && mouseY <= top + height + proximity

      element.style.setProperty('--active', isActive ? '1' : '0')
      if (!isActive) return

      const currentAngle = Number.parseFloat(element.style.getPropertyValue('--start')) || 0
      const targetAngle = (180 * Math.atan2(mouseY - centerY, mouseX - centerX)) / Math.PI + 90
      const angleDelta = ((targetAngle - currentAngle + 180) % 360) - 180
      animationRef.current?.stop()
      animationRef.current = animate(currentAngle, currentAngle + angleDelta, {
        duration: movementDuration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (value) => element.style.setProperty('--start', String(value)),
      })
    })
  }, [inactiveZone, proximity, movementDuration])

  useEffect(() => {
    if (disabled) return

    const handleScroll = () => handleMove()
    document.body.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      animationRef.current?.stop()
      document.body.removeEventListener('pointermove', handleMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [disabled, handleMove])

  const effectStyle = {
    '--blur': `${blur}px`,
    '--spread': spread,
    '--start': '0',
    '--active': '0',
    '--glow-border-width': `${borderWidth}px`,
    '--metal-gradient': `
      radial-gradient(circle at 22% 28%, rgb(255 255 255 / 0.88) 0%, transparent 22%),
      radial-gradient(circle at 75% 72%, rgb(165 243 252 / 0.62) 0%, transparent 25%),
      radial-gradient(circle at 68% 30%, rgb(196 181 253 / 0.5) 0%, transparent 22%),
      repeating-conic-gradient(
        from 236.84deg at 50% 50%,
        #737982 0%, #f8fafc 12%, #9ca3af 24%, #dbeafe 36%,
        #717784 48%, #c4b5fd 60%, #f1f5f9 72%, #94a3b8 84%, #737982 100%
      )`,
  } as CSSProperties

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-px rounded-[inherit] border border-white/25 opacity-0 transition-opacity duration-300 ${glow ? 'opacity-100' : ''}`}
      />
      <div
        ref={containerRef}
        aria-hidden="true"
        style={effectStyle}
        className={`pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 ${blur > 0 ? 'blur-[var(--blur)]' : ''} ${className} ${disabled ? 'hidden' : ''}`}
      >
        <div className="glow h-full w-full rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glow-border-width))] after:rounded-[inherit] after:border-[var(--glow-border-width)] after:border-solid after:border-transparent after:content-[''] after:[background:var(--metal-gradient)] after:[background-attachment:fixed] after:opacity-[var(--active)] after:transition-opacity after:duration-300 after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect] after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]" />
      </div>
    </>
  )
})

GlowingEffect.displayName = 'GlowingEffect'

export { GlowingEffect }
