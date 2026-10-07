import Image from 'next/image'
import { AnimatedText } from '@/components/ui/animated-text'
import IndiaClock from './IndiaClock'
import InteractiveDotField from './InteractiveDotField'
import { TechIcon, type TechIconName } from './icons'

const FULL_STACK_TECH: { name: string; icon: TechIconName }[] = [
  { name: 'TypeScript', icon: 'TypeScript' },
  { name: 'React', icon: 'React' },
  { name: 'Next.js', icon: 'Next.js' },
  { name: 'Express', icon: 'Express.js' },
  { name: 'React Native', icon: 'React Native' },
  { name: 'Expo', icon: 'Expo' },
]

const AI_TECH: { name: string; icon: TechIconName }[] = [
  { name: 'Python', icon: 'Python' },
  { name: 'FastAPI', icon: 'FastAPI' },
  { name: 'LangChain', icon: 'LangChain' },
  { name: 'LangGraph', icon: 'LangGraph' },
  { name: 'RAG', icon: 'RAG' },
]

function InlineTechCapsules({
  technologies,
}: {
  technologies: typeof FULL_STACK_TECH
}) {
  return technologies.map((technology, index) => (
    <span key={technology.name}>
      <span className="bg-surface/80 text-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 align-middle text-xs leading-4 font-medium">
        <TechIcon name={technology.icon} className="size-4 shrink-0" />
        {technology.name}
      </span>
      {index < technologies.length - 2
        ? ', '
        : index === technologies.length - 2
          ? ', and '
          : ''}
    </span>
  ))
}

export default function IntroHero() {
  return (
    <section
      aria-labelledby="hero-name"
      className="relative isolate px-8 pt-8 pb-10 sm:px-8 sm:pt-12 sm:pb-12"
    >
      <InteractiveDotField className="hero-dot-texture pointer-events-none absolute inset-x-8 top-0 h-40 sm:inset-x-8" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="bg-surface ring-border/70 relative size-20 shrink-0 overflow-hidden rounded-xl shadow-lg ring-1 shadow-neutral-950/20 sm:size-24">
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
              <h1
                id="hero-name"
                className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Aryan
              </h1>
              <p className="text-muted mt-1 flex flex-wrap items-center gap-x-1.5">
                <span className="text-sm sm:text-base">I&apos;m</span>
                <AnimatedText />
              </p>
            </div>
          </div>

          <div className="text-muted ml-auto flex shrink-0 flex-col items-end gap-1 sm:ml-0">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>India</span>
            </div>
            <IndiaClock />
          </div>
        </div>

        <div
          id="about"
          className="text-muted mt-6 max-w-2xl scroll-mt-6 text-sm leading-6 sm:mt-7 sm:text-[15px]"
        >
          <p>
            I&apos;m an 18-year-old developer and student building AI-powered
            applications, autonomous AI agents, and full-stack platforms for web
            and mobile. I build across{' '}
            <InlineTechCapsules technologies={FULL_STACK_TECH} />, and use{' '}
            <InlineTechCapsules technologies={AI_TECH} /> to build AI agents and
            intelligent systems. I&apos;m interested in taking ideas from simple
            applications to systems that can actually reason, use tools, and get
            work done. Right now, I&apos;m building Crew, an autonomous AI
            workforce that turns goals into completed work.
          </p>
        </div>
      </div>
    </section>
  )
}
