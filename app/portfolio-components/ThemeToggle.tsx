'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { IconMoonStars, IconSun } from '@tabler/icons-react'

type Theme = 'light' | 'dark'

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [iconRotation, setIconRotation] = useState(0)

  useEffect(() => {
    const savedTheme = document.documentElement.dataset.theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'

    setTheme(
      savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : systemTheme,
    )
  }, [])

  function toggleTheme() {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme

    try {
      window.localStorage.setItem('istmx-theme', nextTheme)
    } catch {}

    setTheme(nextTheme)
    setIconRotation((rotation) => rotation + 180)
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'dark'}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      whileHover={{ scale: 1.08, rotate: 8 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 450, damping: 24 }}
      className="text-muted hover:text-foreground active:text-foreground focus-visible:outline-foreground flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <motion.span
        animate={{ rotate: iconRotation }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="flex items-center justify-center"
      >
        {theme === 'dark' ? (
          <IconSun aria-hidden="true" className="size-5" stroke={1.7} />
        ) : (
          <IconMoonStars aria-hidden="true" className="size-5" stroke={1.7} />
        )}
      </motion.span>
    </motion.button>
  )
}

export default ThemeToggle
