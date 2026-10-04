'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'motion/react'
import ThemeToggle from './ThemeToggle'
import { IstmxLogo } from './LogoSvg'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blogs', href: '/blogs' },
]

function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative z-30 mx-auto w-full max-w-3xl px-8 pt-6 sm:px-8 sm:pt-8">
      <nav
        aria-label="Main navigation"
        className="relative flex flex-wrap items-center justify-between gap-y-2 px-1 sm:px-2.5"
      >
        <Link
          href="/"
          aria-label="istmX home"
          className="flex shrink-0 flex-col items-center gap-0.5"
        >
          <IstmxLogo className="size-10 text-foreground sm:size-11" />
          <span className="text-[9px] font-medium tracking-[0.18em] text-muted/60">
            istmX
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-1.5 sm:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href

              return (
                <motion.li
                  key={item.href}
                  whileHover={{ scale: 1.035 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-foreground'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <span className="nav-link-label">{item.label}</span>
                  </Link>
                </motion.li>
              )
            })}
          </ul>

          <ThemeToggle />

          <motion.button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? 'mobile-navigation' : undefined}
            onClick={() => setMenuOpen((open) => !open)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
            className="flex size-9 cursor-pointer items-center justify-center text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground sm:hidden"
          >
            {menuOpen ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.button>
        </div>

        {menuOpen && (
          <ul id="mobile-navigation" className="absolute left-0 right-0 top-full z-50 mt-2 flex flex-col gap-1 rounded-xl border border-border/70 bg-background/95 p-2 shadow-xl backdrop-blur-md sm:hidden">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href

              return (
                <motion.li
                  key={item.href}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-foreground'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <span className="nav-link-label">{item.label}</span>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        )}
      </nav>
    </header>
  )
}

export default Navbar
