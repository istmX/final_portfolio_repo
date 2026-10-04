'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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
  const menuRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.parentElement?.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  return (
    <header className="relative z-30 mx-auto w-full max-w-3xl px-8 pt-6 sm:px-8 sm:pt-8">
      <nav
        aria-label="Main navigation"
        className="relative flex flex-wrap items-center justify-between gap-y-2 px-1 sm:px-2.5"
      >
        <Link
          href="/"
          scroll={true}
          onClick={() => {
            setMenuOpen(false)
            if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
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

        <AnimatePresence>
        {menuOpen && (
          <motion.ul ref={menuRef} id="mobile-navigation" className="mobile-nav-panel absolute left-1/2 top-full z-50 mt-2 flex w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-1 rounded-xl border bg-background/95 p-2 shadow-xl backdrop-blur-md sm:hidden"
            initial={{ opacity: 0, y: -7, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.99 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
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
                    className={`block rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
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
          </motion.ul>
        )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Navbar
