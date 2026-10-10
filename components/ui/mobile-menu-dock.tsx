'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  IconArrowRight,
  IconArrowUpRight,
  IconGridDots,
  IconSearch,
  IconX,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export type MobileMenuDockItem = {
  label: string
  href: string
  active?: boolean
}

export type MobileMenuDockSearchItem = {
  name: string
  slug: string
  href: string
  category: string
  description: string
}

export type MobileMenuDockProps = {
  items: MobileMenuDockItem[]
  searchItems: readonly MobileMenuDockSearchItem[]
  label?: string
  placement?: 'fixed' | 'inline'
  className?: string
}

export default function MobileMenuDock({
  items,
  searchItems,
  label = 'Mobile navigation',
  placement = 'fixed',
  className,
}: MobileMenuDockProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const reduceMotion = useReducedMotion()
  const filteredComponents = searchItems.filter((item) =>
    `${item.name} ${item.category} ${item.description}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  )

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  function toggleMenu() {
    setOpen((current) => !current)
    setQuery('')
  }

  return (
    <div
      className={cn(
        placement === 'fixed'
          ? 'fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-50 mx-auto w-[min(21rem,calc(100vw-2rem))] sm:hidden'
          : 'relative z-10 mx-auto w-full',
        className,
      )}
    >
      <AnimatePresence initial={false}>
        {open ? (
          <motion.nav
            id="mobile-menu-dock-panel"
            aria-label={label}
            className="border-border/80 bg-background/95 mb-2 overflow-hidden rounded-xl border p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl"
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5, scale: 0.99 }
            }
            transition={{
              duration: reduceMotion ? 0.12 : 0.2,
              ease: 'easeOut',
            }}
          >
            <div className="border-border/60 text-muted border-b px-3.5 py-2 font-mono text-[9px] tracking-[0.12em] uppercase">
              {query.trim() ? 'Components' : 'Navigate'}
            </div>
            <ul className="max-h-[min(55vh,24rem)] overflow-y-auto">
              {query.trim() ? (
                filteredComponents.length ? (
                  filteredComponents.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          setOpen(false)
                          setQuery('')
                        }}
                        className="text-muted hover:bg-surface/70 hover:text-foreground flex min-h-12 items-center gap-3 rounded-lg px-3.5 transition-colors"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-3">
                            <span className="font-display text-foreground text-sm font-medium">
                              {item.name}
                            </span>
                            <span className="font-mono text-[9px] tracking-wide uppercase">
                              {item.category}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate text-xs">
                            {item.description}
                          </span>
                        </span>
                        <IconArrowRight
                          aria-hidden="true"
                          className="shrink-0"
                          size={15}
                          stroke={1.6}
                        />
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-muted px-3.5 py-4 text-center text-sm">
                    No items match “{query}”.
                  </li>
                )
              ) : (
                items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={item.active ? 'page' : undefined}
                      onClick={() => {
                        setOpen(false)
                        setQuery('')
                      }}
                      className={cn(
                        'flex min-h-11 items-center justify-between rounded-lg px-3.5 text-sm transition-colors',
                        item.active
                          ? 'bg-surface text-foreground'
                          : 'text-muted hover:bg-surface/70 hover:text-foreground',
                      )}
                    >
                      {item.label}
                      <IconArrowUpRight
                        aria-hidden="true"
                        className="text-muted/60"
                        size={15}
                        stroke={1.6}
                      />
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <div className="border-border/80 bg-background/95 flex h-12 items-center gap-2 rounded-xl border px-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <IconSearch
          aria-hidden="true"
          className="text-muted shrink-0"
          size={17}
          stroke={1.7}
        />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search..."
          aria-label="Search by name, category, or description"
          aria-controls="mobile-menu-dock-panel"
          className="text-foreground placeholder:text-muted/70 min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <button
          type="button"
          onClick={toggleMenu}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-menu-dock-panel"
          className="border-border/70 bg-surface/45 text-muted hover:border-foreground/40 hover:text-foreground focus-visible:outline-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {open ? (
            <IconX aria-hidden="true" size={16} stroke={1.8} />
          ) : (
            <IconGridDots aria-hidden="true" size={16} stroke={1.8} />
          )}
        </button>
      </div>
    </div>
  )
}
