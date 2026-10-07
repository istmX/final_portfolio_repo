'use client'

import { useEffect } from 'react'

export default function ThemeInit() {
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('istmx-theme')
      if (savedTheme === 'light' || savedTheme === 'dark') {
        document.documentElement.dataset.theme = savedTheme
      }
    } catch {
      // Theme persistence is optional when storage is unavailable.
    }
  }, [])

  return null
}
