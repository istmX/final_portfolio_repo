'use client'

import { useEffect, useRef } from 'react'
import { ANIMATIONS, CAT_SIZE, getCatFrameCanvas, type CatAnim } from '@/lib/cat/sprite'

export type CatSpritePose = Extract<CatAnim, 'idle' | 'walk' | 'sit' | 'sleep' | 'alert' | 'happy'>

export default function CatSprite({ anim, animated }: { anim: CatSpritePose; animated: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = false
    const { fps, frames } = ANIMATIONS[anim]
    let index = 0
    const draw = () => {
      ctx.clearRect(0, 0, CAT_SIZE, CAT_SIZE)
      ctx.drawImage(getCatFrameCanvas(anim, index), 0, 0)
    }

    draw()
    if (!animated) return

    const interval = window.setInterval(() => {
      index = (index + 1) % frames.length
      draw()
    }, 1000 / fps)

    return () => window.clearInterval(interval)
  }, [anim, animated])

  return (
    <canvas
      ref={ref}
      width={CAT_SIZE}
      height={CAT_SIZE}
      aria-hidden="true"
      className="block h-full w-full"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
