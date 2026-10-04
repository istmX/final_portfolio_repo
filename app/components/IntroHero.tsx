import Image from 'next/image'
import AnimatedRole from './AnimatedRole'
import IndiaClock from './IndiaClock'

const TECH = [
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'React', icon: 'react' },
  { name: 'Motion', icon: 'motion' },
  { name: 'Python', icon: 'python' },
  { name: 'Next.js', icon: 'nextjs' },
  { name: 'Express.js', icon: 'express' },
  { name: 'LangChain', icon: 'langchain' },
  { name: 'LangGraph', icon: 'langgraph' },
  { name: 'RAG', icon: 'rag' },
] as const

function TechIcon({ name }: { name: (typeof TECH)[number]['icon'] }) {
  const iconClass = `size-4 shrink-0 ${
    name === 'typescript'
      ? 'text-[#3178c6]'
      : name === 'react'
        ? 'text-[#61dafb]'
      : name === 'python'
        ? 'text-[#3776ab]'
        : name === 'express'
          ? 'text-[#888]'
          : name === 'langchain'
            ? 'text-[#168b72]'
            : name === 'langgraph'
              ? 'text-[#e15744]'
              : 'text-muted'
  }`

  if (name === 'typescript') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 17.5c.32.32.754.5 1.207.5h.543c.69 0 1.25-.56 1.25-1.25v-.25a1.5 1.5 0 0 0-1.5-1.5a1.5 1.5 0 0 1-1.5-1.5v-.25c0-.69.56-1.25 1.25-1.25h.543c.453 0 .887.18 1.207.5M9 12h4m-2 0v6" />
        <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z" />
      </svg>
    )
  }

  if (name === 'react') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'python') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3m4-2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" />
        <path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4" />
        <circle cx="11" cy="6" r=".7" fill="currentColor" />
        <circle cx="13" cy="18" r=".7" fill="currentColor" />
      </svg>
    )
  }

  if (name === 'express') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={iconClass}>
        <text x="12" y="17" textAnchor="middle" fill="currentColor" fontSize="15" fontWeight="700" fontFamily="Georgia, serif" letterSpacing="-1.5">ex</text>
      </svg>
    )
  }

  if (name === 'motion') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18 10 6h4l-6 12H4Zm8 0 6-12h2l-6 12h-2Z" />
      </svg>
    )
  }

  if (name === 'langchain') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 5v14m0-7h6m0 0 6-6m-6 6 6 6" />
        <circle cx="6" cy="5" r="2" fill="var(--surface)" />
        <circle cx="6" cy="19" r="2" fill="var(--surface)" />
        <circle cx="12" cy="12" r="2" fill="var(--surface)" />
        <circle cx="18" cy="6" r="2" fill="var(--surface)" />
        <circle cx="18" cy="18" r="2" fill="var(--surface)" />
      </svg>
    )
  }

  if (name === 'rag') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5M7.5 10.5h6M10.5 7.5v6" />
      </svg>
    )
  }

  if (name === 'langgraph') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7 7 5 5 5-5M12 12v5M7 7l-1.5 9M17 7l1.5 9" />
        <circle cx="7" cy="6" r="2" fill="var(--background)" />
        <circle cx="17" cy="6" r="2" fill="var(--background)" />
        <circle cx="12" cy="12" r="2" fill="var(--background)" />
        <circle cx="5.5" cy="17" r="2" fill="var(--background)" />
        <circle cx="18.5" cy="17" r="2" fill="var(--background)" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={iconClass} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 15v-6l7.745 10.65a9 9 0 1 1 2.255-1.993" />
      <path d="M15 12V9" />
    </svg>
  )
}

export default function IntroHero() {
  return (
    <section aria-labelledby="hero-name" className="relative isolate px-8 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-12">
      <div aria-hidden="true" className="hero-dot-texture pointer-events-none absolute inset-x-8 top-0 h-40 sm:inset-x-8" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/70 shadow-lg shadow-neutral-950/20 sm:size-24">
              <Image
                src="/hero.png"
                alt="Illustrated portrait of Aryan"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover"
                priority
              />
            </div>

            <div className="min-w-0">
              <h1 id="hero-name" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Aryan
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-muted">
                <span className="text-sm sm:text-base">I&apos;m an</span>
                <AnimatedRole />
              </p>
            </div>
          </div>

          <div className="ml-auto flex shrink-0 flex-col items-end gap-1 text-muted sm:ml-0">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>India</span>
            </div>
            <IndiaClock />
          </div>
        </div>

        <div className="mt-6 max-w-2xl space-y-3 text-sm leading-6 text-muted sm:mt-7 sm:text-[15px]">
          <p>
            I&apos;m Aryan, a developer in India focused on AI engineering. I build
            full-stack web and mobile products, and lately I&apos;ve been working
            with language models, retrieval, and tool-driven workflows. I&apos;m
            building Crew to help turn a goal into finished work.
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span className="mr-1">My everyday toolkit:</span>
            {TECH.map((technology) => (
              <span
                key={technology.name}
                className="inline-flex items-center gap-1.5 rounded-md bg-surface/80 px-2 py-1 text-xs font-medium leading-4 text-foreground"
              >
                <TechIcon name={technology.icon} />
                {technology.name}
              </span>
            ))}
            <span className="basis-full pt-1">
              I&apos;m building Crew, an AI workforce that turns a goal into completed work.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
