'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ScrollToHome() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/' || window.location.hash) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}
