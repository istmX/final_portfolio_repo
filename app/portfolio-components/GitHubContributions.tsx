'use client'

import Link from 'next/link'
import { IconArrowUpRight } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

type ContributionDay = {
  date: string
  count: number
  level: number
}

type ContributionsResponse = {
  contributions: ContributionDay[]
}

const CONTRIBUTIONS_API =
  'https://github-contributions-api.jogruber.de/v4/istmX'

function contributionDescription(day: ContributionDay) {
  return `${day.count} ${day.count === 1 ? 'contribution' : 'contributions'} on ${new Date(
    `${day.date}T00:00:00`,
  ).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`
}

export default function GitHubContributions() {
  const year = new Date().getUTCFullYear()
  const [days, setDays] = useState<ContributionDay[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setDays(null)
    setFailed(false)

    fetch(`${CONTRIBUTIONS_API}?y=${year}`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load contribution data')
        return response.json() as Promise<ContributionsResponse>
      })
      .then((response) => {
        if (!Array.isArray(response.contributions))
          throw new Error('Contribution data is unavailable')
        setDays(response.contributions)
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return
        setFailed(true)
      })

    return () => controller.abort()
  }, [year])

  const visibleDays = days?.filter(
    (day) => day.date <= new Date().toISOString().slice(0, 10),
  )
  const firstDate = visibleDays?.[0]?.date
  const leadingDays = firstDate
    ? new Date(`${firstDate}T00:00:00Z`).getUTCDay()
    : 0
  const weekCount = visibleDays
    ? Math.ceil((leadingDays + visibleDays.length) / 7)
    : 53
  const slots = Array.from({ length: weekCount * 7 }, (_, index) => {
    const dayIndex = index - leadingDays
    return dayIndex >= 0 && visibleDays ? visibleDays[dayIndex] : undefined
  })
  const total = visibleDays?.reduce((sum, day) => sum + day.count, 0) ?? 0
  const monthMarkers =
    visibleDays
      ?.flatMap((day, index) => {
        const date = new Date(`${day.date}T00:00:00Z`)
        if (date.getUTCDate() !== 1) return []
        return [
          {
            label: date.toLocaleString('en', {
              month: 'short',
              timeZone: 'UTC',
            }),
            week: Math.floor((leadingDays + index) / 7),
          },
        ]
      })
      .filter(
        (month, index, months) =>
          index === 0 || month.week !== months[index - 1].week,
      ) ?? []

  return (
    <section
      id="github-contributions"
      aria-labelledby="github-contributions-heading"
      className="border-border/50 border-t border-dotted px-8 pt-8 pb-10 sm:px-8 sm:pb-12"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-3 sm:px-4">
        <div>
          <p className="text-muted text-[10px] font-medium tracking-[0.18em] uppercase">
            GitHub profile
          </p>
          <h2
            id="github-contributions-heading"
            className="font-display mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            GitHub Contributions
          </h2>
          <p className="text-muted mt-1 text-xs">
            A snapshot of my coding activity throughout the year.
          </p>
          <p className="text-muted mt-1 text-xs">
            {days ? `${year} · ${total.toLocaleString()} contributions` : year}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/istmX"
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-foreground focus-visible:outline-foreground inline-flex items-center gap-1 text-[10px] font-medium tracking-[0.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-3"
          >
            @istmX{' '}
            <IconArrowUpRight size={13} stroke={1.7} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="border-border/50 bg-surface/15 rounded-[16px] border p-3 sm:p-4">
        {visibleDays ? (
          <>
            <div
              aria-hidden="true"
              className="text-muted/75 mb-1 grid text-[8px] sm:text-[10px]"
              style={{
                gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))`,
              }}
            >
              {monthMarkers.map((month) => (
                <span
                  key={`${month.label}-${month.week}`}
                  className="whitespace-nowrap"
                  style={{ gridColumn: `${month.week + 1} / span 4` }}
                >
                  <span className="sm:hidden">{month.label.slice(0, 1)}</span>
                  <span className="hidden sm:inline">{month.label}</span>
                </span>
              ))}
            </div>
            <div
              role="img"
              aria-label={`GitHub contributions for ${year}: ${total} total contributions`}
              className="grid grid-flow-col grid-rows-7 gap-px sm:gap-1"
              style={{
                gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))`,
              }}
            >
              {slots.map((day, index) =>
                day ? (
                  <span
                    key={day.date}
                    title={contributionDescription(day)}
                    className={`contribution-day contribution-level-${Math.max(0, Math.min(4, day.level))} aspect-square min-w-0 rounded-[2px]`}
                  />
                ) : (
                  <span
                    key={`empty-${index}`}
                    aria-hidden="true"
                    className="aspect-square min-w-0"
                  />
                ),
              )}
            </div>
          </>
        ) : (
          <div
            aria-live="polite"
            className="text-muted flex min-h-12 items-center justify-center text-xs"
          >
            {failed
              ? 'Contribution activity is temporarily unavailable.'
              : 'Loading contribution activity…'}
          </div>
        )}
        <div className="text-muted/75 mt-3 flex items-center justify-between gap-3 text-[10px]">
          <span>Daily activity</span>
          <div
            aria-label="Contribution intensity: less to more"
            className="flex items-center gap-1"
          >
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span
                key={level}
                aria-hidden="true"
                className={`contribution-day contribution-level-${level} size-2.5 rounded-[2px]`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  )
}
