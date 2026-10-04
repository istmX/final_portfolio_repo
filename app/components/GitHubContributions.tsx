'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type ContributionDay = {
  date: string
  count: number
  level: number
}

type ContributionsResponse = {
  contributions: ContributionDay[]
}

const CONTRIBUTIONS_URL = 'https://github-contributions-api.jogruber.de/v4/istmX?y=last'

function contributionDescription(day: ContributionDay) {
  return `${day.count} ${day.count === 1 ? 'contribution' : 'contributions'} on ${new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`
}

export default function GitHubContributions() {
  const [days, setDays] = useState<ContributionDay[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch(CONTRIBUTIONS_URL, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load contribution data')
        return response.json() as Promise<ContributionsResponse>
      })
      .then((response) => {
        if (!Array.isArray(response.contributions)) throw new Error('Contribution data is unavailable')
        setDays(response.contributions)
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return
        setFailed(true)
      })

    return () => controller.abort()
  }, [])

  const firstDate = days?.[0]?.date
  const leadingDays = firstDate ? new Date(`${firstDate}T00:00:00Z`).getUTCDay() : 0
  const weekCount = days ? Math.ceil((leadingDays + days.length) / 7) : 53
  const slots = Array.from({ length: weekCount * 7 }, (_, index) => {
    const dayIndex = index - leadingDays
    return dayIndex >= 0 && days ? days[dayIndex] : undefined
  })
  const total = days?.reduce((sum, day) => sum + day.count, 0) ?? 0

  return (
    <section id="github-contributions" aria-labelledby="github-contributions-heading" className="border-t border-dotted border-border/50 px-8 pb-10 pt-8 sm:px-8 sm:pb-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">GitHub contributions</p>
          <h2 id="github-contributions-heading" className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {days ? `${total.toLocaleString()} contributions` : 'Contribution activity'}
          </h2>
        </div>
        <Link href="https://github.com/istmX" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground">
          @istmX <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="rounded-[16px] border border-border/50 bg-surface/15 p-3 sm:p-4">
        {days ? (
          <div role="img" aria-label={`GitHub contributions for the last year: ${total} total contributions`} className="grid grid-flow-col grid-rows-7 gap-px sm:gap-1" style={{ gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))` }}>
            {slots.map((day, index) => day ? (
              <span key={day.date} title={contributionDescription(day)} className={`contribution-day contribution-level-${Math.max(0, Math.min(4, day.level))} aspect-square min-w-0 rounded-[2px]`} />
            ) : (
              <span key={`empty-${index}`} aria-hidden="true" className="aspect-square min-w-0" />
            ))}
          </div>
        ) : (
          <div aria-live="polite" className="flex min-h-12 items-center justify-center text-xs text-muted">
            {failed ? 'Contribution activity is temporarily unavailable.' : 'Loading contribution activity…'}
          </div>
        )}
        <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-muted/75">
          <span>Last 12 months</span>
          <div aria-label="Contribution intensity: less to more" className="flex items-center gap-1">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => <span key={level} aria-hidden="true" className={`contribution-day contribution-level-${level} size-2.5 rounded-[2px]`} />)}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  )
}
