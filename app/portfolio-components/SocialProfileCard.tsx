'use client'

import Image from 'next/image'
import { useState, type FocusEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

type SocialProfileCardProps = {
  name: string
  handle: string
  href: string
  detail: string
  children: ReactNode
  isEmail?: boolean
  className?: string
}

export default function SocialProfileCard({
  name,
  handle,
  href,
  detail,
  children,
  isEmail = false,
  className = '',
}: SocialProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ left: 12, top: 12 })
  const reduceMotion = useReducedMotion()

  function showCard(element: HTMLElement) {
    const rect = element.getBoundingClientRect()
    const cardWidth = Math.min(320, window.innerWidth - 24)
    const left = Math.max(
      12,
      Math.min(
        rect.left + rect.width / 2 - cardWidth / 2,
        window.innerWidth - cardWidth - 12,
      ),
    )
    const cardHeight = 190
    const above = rect.top - cardHeight - 12 >= 12

    setPosition({
      left,
      top: above ? rect.top - cardHeight - 12 : rect.bottom + 12,
    })
    setIsOpen(true)
  }

  function hideOnBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={(event) => showCard(event.currentTarget)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={(event) => showCard(event.currentTarget)}
      onBlur={hideOnBlur}
    >
      <a
        href={href}
        aria-label={name === 'Email' ? 'Email Aryan' : `Open ${name} profile`}
        target={isEmail ? undefined : '_blank'}
        rel={isEmail ? undefined : 'noreferrer'}
        className={className}
      >
        {children}
      </a>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 7, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.99 }
            }
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="border-border bg-background/95 fixed z-30 rounded-2xl border p-4 shadow-xl shadow-neutral-950/20 backdrop-blur-xl"
            style={{
              left: position.left,
              top: position.top,
              width: 'min(320px, calc(100vw - 24px))',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="border-border/70 bg-surface relative size-14 shrink-0 overflow-hidden rounded-xl border">
                <Image
                  src="/hero.png"
                  alt="Aryan’s profile portrait"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-foreground text-base leading-5 font-semibold">
                  Aryan
                </h3>
                <p className="text-muted mt-1 truncate text-xs">{handle}</p>
                <p className="text-muted mt-1 flex items-center gap-1 text-xs">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-3.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  India
                </p>
              </div>
              <span className="border-border/70 text-muted ml-auto flex size-9 shrink-0 items-center justify-center rounded-lg border">
                {children}
              </span>
            </div>

            <p className="text-muted mt-3 text-[13px] leading-5">{detail}</p>

            <a
              href={href}
              target={isEmail ? undefined : '_blank'}
              rel={isEmail ? undefined : 'noreferrer'}
              className="text-foreground mt-3 inline-flex items-center gap-1.5 text-xs font-medium hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {isEmail ? 'Send an email' : `Open ${name} profile`}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                className="size-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12 12 4M5 4h7v7" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
