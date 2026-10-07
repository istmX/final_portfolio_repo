'use client'

import { useEffect, useRef } from 'react'

export default function InteractiveDotField({
  className = '',
}: {
  className?: string
}) {
  const fieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const field = fieldRef.current
    if (!field) return

    let frame = 0
    let pointer: PointerEvent | null = null

    const updateField = () => {
      frame = 0
      if (!pointer) return

      const { left, top, right, bottom } = field.getBoundingClientRect()
      const { clientX, clientY } = pointer

      if (
        clientX < left ||
        clientX > right ||
        clientY < top ||
        clientY > bottom
      ) {
        field.style.setProperty('--dot-cursor-x', '-100px')
        field.style.setProperty('--dot-cursor-y', '-100px')
        return
      }

      field.style.setProperty('--dot-cursor-x', `${clientX - left}px`)
      field.style.setProperty('--dot-cursor-y', `${clientY - top}px`)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer = event
      if (!frame) frame = window.requestAnimationFrame(updateField)
    }

    const onPointerLeave = () => {
      pointer = null
      field.style.setProperty('--dot-cursor-x', '-100px')
      field.style.setProperty('--dot-cursor-y', '-100px')
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('blur', onPointerLeave)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', onPointerLeave)
    }
  }, [])

  return (
    <div
      ref={fieldRef}
      aria-hidden="true"
      className={`interactive-dot-field ${className}`}
    />
  )
}
