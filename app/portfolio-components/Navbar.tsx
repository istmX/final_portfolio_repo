'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { IconBrandGithub, IconSearch, IconX } from '@tabler/icons-react'
import MobileMenuDock from '@/components/ui/mobile-menu-dock'
import ThemeToggle from './ThemeToggle'
import { IstmxLogo } from './LogoSvg'
import { COMPONENT_ICONS } from './ComponentsSpotlight'
import { COMPONENT_SEARCH_ITEMS } from './library/component-search-data'

const NAV_ITEMS = [
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Components', href: '/library' },
  { label: 'Blogs', href: '/blogs' },
]

function Navbar() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTriggerRef = useRef<HTMLButtonElement>(null)
  const filteredComponents = COMPONENT_SEARCH_ITEMS.filter((item) =>
    `${item.name} ${item.category} ${item.description}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase()),
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

      const isSearchShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'

      if (
        ((event.key === '/' && !event.metaKey && !event.ctrlKey) ||
          isSearchShortcut) &&
        !isTyping
      ) {
        event.preventDefault()
        setSearchOpen(true)
      }

      if (event.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
        setSearchQuery('')
        searchTriggerRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [searchOpen])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [searchOpen])

  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <header className="border-border/50 relative z-30 mx-auto w-full max-w-3xl border-b px-8 pt-6 pb-3 sm:px-8 sm:pt-8 sm:pb-3">
      <nav
        aria-label="Main navigation"
        className="relative flex flex-wrap items-center justify-between gap-y-2 px-1 sm:flex-nowrap sm:px-2.5"
      >
        <Link
          href="/"
          scroll={true}
          onClick={() => {
            if (pathname === '/')
              window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          aria-label="istmX home"
          className="flex shrink-0 items-center gap-2"
        >
          <IstmxLogo className="text-foreground size-8 sm:size-9" />
          <span className="font-display text-foreground text-sm font-semibold tracking-tight sm:text-base">
            istmX
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ul className="hidden items-center gap-1.5 sm:flex">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(`${item.href}/`))

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
                    className={`block rounded-sm px-2 py-2 text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-foreground'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              )
            })}
          </ul>

          <button
            ref={searchTriggerRef}
            type="button"
            aria-label="Search components"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(true)}
            className="border-border/50 text-muted hover:text-foreground focus-visible:outline-foreground hidden h-8 cursor-pointer items-center gap-2 border-l pl-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:inline-flex sm:pl-3"
          >
            <IconSearch aria-hidden="true" size={15} stroke={1.7} />
            <span className="hidden text-[11px] font-medium md:inline">
              Search
            </span>
            <span className="hidden items-center gap-1 md:inline-flex">
              <kbd className="border-border/60 rounded-sm border px-1 py-0.5 font-mono text-[9px] leading-3">
                Ctrl
              </kbd>
              <kbd className="border-border/60 rounded-sm border px-1 py-0.5 font-mono text-[9px] leading-3">
                K
              </kbd>
            </span>
          </button>

          <a
            href="https://github.com/istmX/final_portfolio_repo"
            target="_blank"
            rel="noreferrer"
            aria-label="Open the istmX portfolio repository on GitHub"
            title="GitHub repository"
            className="border-border/50 text-muted hover:text-foreground focus-visible:outline-foreground inline-flex size-8 items-center justify-center border-l pl-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <IconBrandGithub aria-hidden="true" size={16} stroke={1.7} />
          </a>

          <ThemeToggle />
        </div>

        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              className="fixed inset-0 z-[100] flex items-start justify-center bg-black/45 px-4 pt-[min(18vh,8rem)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeSearch()
              }}
            >
              <motion.section
                role="dialog"
                aria-modal="true"
                aria-labelledby="component-search-title"
                className="border-border bg-background w-full max-w-xl rounded-sm border p-3 shadow-xl sm:p-4"
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.99 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <div>
                    <p
                      id="component-search-title"
                      className="font-display text-sm font-semibold"
                    >
                      Find a component
                    </p>
                    <p className="text-muted mt-0.5 text-[10px]">
                      Search the istmX source library
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeSearch}
                    aria-label="Close component search"
                    className="text-muted hover:text-foreground focus-visible:outline-foreground inline-flex size-8 items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <IconX aria-hidden="true" size={17} stroke={1.7} />
                  </button>
                </div>

                <div className="border-border/60 bg-surface/25 focus-within:border-foreground/40 flex h-11 items-center gap-2 border px-3 transition-colors">
                  <IconSearch
                    aria-hidden="true"
                    className="text-muted shrink-0"
                    size={17}
                    stroke={1.7}
                  />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Name, category, or effect..."
                    aria-label="Search components by name, category, or description"
                    className="text-foreground placeholder:text-muted/65 min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('')
                        searchInputRef.current?.focus()
                      }}
                      aria-label="Clear search"
                      className="text-muted hover:text-foreground inline-flex size-7 items-center justify-center transition-colors"
                    >
                      <IconX aria-hidden="true" size={14} stroke={1.7} />
                    </button>
                  ) : null}
                </div>

                <ul className="mt-3 max-h-[min(55vh,24rem)] overflow-y-auto">
                  {filteredComponents.length ? (
                    filteredComponents.map((item) => {
                      const ComponentIcon = COMPONENT_ICONS[item.slug]

                      return (
                        <li key={item.slug}>
                          <Link
                            href={`/library/${item.slug}`}
                            onClick={closeSearch}
                            className="group hover:bg-surface/35 focus-visible:bg-surface/35 focus-visible:outline-foreground border-border/40 flex items-center gap-3 border-b px-3 py-3 transition-colors focus-visible:outline focus-visible:outline-1"
                          >
                            <span className="border-border/60 bg-surface/40 text-muted group-hover:text-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors">
                              <ComponentIcon
                                aria-hidden="true"
                                size={16}
                                stroke={1.6}
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center justify-between gap-3">
                                <span className="font-display text-sm font-semibold">
                                  {item.name}
                                </span>
                                <span className="text-muted font-mono text-[9px] tracking-[0.12em] uppercase">
                                  {item.category}
                                </span>
                              </span>
                              <span className="text-muted mt-1 block text-xs leading-5">
                                {item.description}
                              </span>
                            </span>
                          </Link>
                        </li>
                      )
                    })
                  ) : (
                    <li className="text-muted px-3 py-6 text-center text-sm">
                      No components match “{searchQuery}”.
                    </li>
                  )}
                </ul>
                <div className="border-border/60 text-muted mt-2 flex items-center justify-between border-t border-dotted px-2 pt-3 text-[10px]">
                  <span>{filteredComponents.length} components</span>
                  <span>
                    Press <kbd className="font-mono">Esc</kbd> to close
                  </span>
                </div>
              </motion.section>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
      <MobileMenuDock
        searchItems={COMPONENT_SEARCH_ITEMS}
        items={NAV_ITEMS.map((item) => ({
          ...item,
          active:
            item.href === '/library'
              ? pathname.startsWith('/library')
              : pathname === item.href,
        }))}
      />
    </header>
  )
}

export default Navbar
