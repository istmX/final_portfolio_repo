'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blogs', href: '/blogs' },
]

function Navbar() {
  const pathname = usePathname()

  return (
    <header className="mx-auto w-full max-w-3xl px-4 pt-6 sm:px-6 sm:pt-8">
      <nav
        aria-label="Main navigation"
        className="flex flex-wrap items-center justify-between gap-y-2 px-2.5"
      >
        <Link href="/" aria-label="istmX home" className="shrink-0">
          <Image
            src="/istmx-logo.svg"
            alt="istmX"
            width={90}
            height={26}
            priority
            className="brand-logo h-[26px] w-[90px]"
          />
        </Link>

        <div className="flex w-full items-center justify-between gap-1 sm:w-auto sm:justify-end sm:gap-3">
          <ul className="flex flex-1 items-center justify-center gap-0 sm:flex-initial sm:gap-1.5">
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
                    className={`block rounded-full px-2 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
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
        </div>
      </nav>
    </header>
  )
}

export default Navbar
