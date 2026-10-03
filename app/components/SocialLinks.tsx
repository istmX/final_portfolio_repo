'use client'

import Image from 'next/image'
import { useState } from 'react'
import GitHubProfileEmbed from './GitHubProfileEmbed'
import XProfileEmbed from './XProfileEmbed'

const SOCIALS = [
  {
    name: 'GitHub',
    handle: '@istmX',
    href: 'https://github.com/istmX',
    detail: 'Repositories, experiments, and current work.',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.6 1.2 3.24.92.1-.72.39-1.2.7-1.48-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.15-3-.12-.29-.5-1.43.11-2.98 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.55.23 2.69.12 2.98.71.78 1.14 1.78 1.14 3 0 4.29-2.6 5.23-5.09 5.51.4.35.75 1.02.75 2.06V22c0 .29.2.64.77.53A11.1 11.1 0 0 0 12 .9Z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    handle: 'linkedin.com/in/aryan-xf',
    href: 'https://www.linkedin.com/in/aryan-xf/',
    detail: 'AI engineering · Full-stack development · Mobile',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M5.2 3.4a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.4 9h3.7v11.6H3.4V9Zm5.9 0h3.5v1.6h.05a3.85 3.85 0 0 1 3.46-1.9c3.7 0 4.39 2.43 4.39 5.6v6.3H17v-5.59c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.69H9.3V9Z" />
      </svg>
    ),
  },
  {
    name: 'X',
    handle: '@Istm_x',
    href: 'https://x.com/Istm_x',
    detail: 'Posts about building, AI, and ideas in progress.',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-[17px]">
        <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.26l-4.9-7.58L5.4 22H2.27l7.25-8.29L1.8 2h6.42l4.43 6.96L18.9 2Zm-1.1 18h1.73L7.28 3.9H5.42L17.8 20Z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    handle: 'xparyan68@gmail.com',
    href: 'mailto:xparyan68@gmail.com',
    detail: 'Have a project or a question? Send me a note.',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-[18px]" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
] as const

export default function SocialLinks() {
  const [activeSocial, setActiveSocial] = useState<string | null>(null)

  return (
    <section aria-label="Social links" className="px-4 pb-8 sm:px-6">
      <div className="flex items-center gap-3">
        <h2 className="shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-muted">
          Elsewhere
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-border/70" />
        <div className="flex items-center gap-[3px]">
          {SOCIALS.map((social) => {
            const active = activeSocial === social.name
            const external = social.name !== 'Email'

            return (
              <div
                key={social.name}
                className="group relative rounded-[15px] border border-border/30 p-[3px] transition-colors duration-200 hover:border-border/70 focus-within:border-border/70"
                onMouseEnter={() => setActiveSocial(social.name)}
                onMouseLeave={() => setActiveSocial(null)}
                onFocus={() => setActiveSocial(social.name)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setActiveSocial(null)
                }}
              >
                <a
                  aria-label={social.name}
                  className="relative z-10 flex size-10 items-center justify-center rounded-[11px] border border-border/70 text-muted transition-colors duration-200 hover:border-foreground/60 hover:text-foreground focus-visible:border-foreground/60 focus-visible:text-foreground focus-visible:outline-none"
                  href={social.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                >
                  {social.icon}
                </a>

                {active && (
                  <div className="absolute bottom-full right-0 z-20 w-[min(18rem,calc(100vw-2rem))] translate-y-1 rounded-2xl border border-border bg-background/95 p-4 opacity-0 shadow-xl shadow-neutral-950/10 backdrop-blur-xl transition duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:w-80">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                        {social.name === 'Email' ? 'Contact' : 'Profile preview'}
                      </span>
                      <span className="flex size-7 items-center justify-center rounded-lg border border-border/70 text-muted">
                        {social.icon}
                      </span>
                    </div>

                    {social.name === 'GitHub' ? (
                      <GitHubProfileEmbed />
                    ) : social.name === 'X' ? (
                      <XProfileEmbed />
                    ) : (
                      <div className="mt-4 rounded-xl border border-border/70 bg-surface/45 p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-border/70">
                            <Image src="/hero.png" alt="" fill sizes="44px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">Aryan</p>
                            <p className="truncate text-xs text-muted">{social.handle}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-xs leading-5 text-muted">{social.detail}</p>
                      </div>
                    )}

                    <a
                      href={social.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      {social.name === 'Email' ? 'Write an email' : 'Open profile'}
                      <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12 12 4M5 4h7v7" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
