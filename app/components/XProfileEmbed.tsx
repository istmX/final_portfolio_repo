'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement) => Promise<unknown>
      }
    }
  }
}

export default function XProfileEmbed() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const updateTheme = () => {
      setTheme((root.dataset.theme as 'light' | 'dark' | undefined) ?? (media.matches ? 'dark' : 'light'))
    }

    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    media.addEventListener('change', updateTheme)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', updateTheme)
    }
  }, [])

  const loadTimeline = () => {
    void window.twttr?.widgets?.load()
  }

  useEffect(loadTimeline, [theme])

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border/70 bg-surface/45 px-2 pt-2">
      <Script
        src="https://platform.x.com/widgets.js"
        strategy="lazyOnload"
        onReady={loadTimeline}
      />
      <a
        key={theme}
        className="twitter-timeline"
        href="https://x.com/Istm_x"
        data-theme={theme}
        data-height="300"
        data-width="100%"
        data-chrome="noheader nofooter noborders transparent"
        data-tweet-limit="3"
      >
        Posts by @Istm_x
      </a>
    </div>
  )
}
