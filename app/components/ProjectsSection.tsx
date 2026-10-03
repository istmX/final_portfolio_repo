import Image from 'next/image'
import { PROJECTS, type Project } from '../data/projects'
import ScrollReveal from './ScrollReveal'
import { TechIcon } from './icons'
import { IstmxLogo } from './LogoSvg'

function ProjectGlyph({ project }: { project: Project }) {
  return (
    <span aria-hidden="true" className={`project-mark project-mark-${project.glow} flex size-10 shrink-0 items-center justify-center rounded-xl border`}>
      {project.slug === 'istmx-skills' ? (
        <IstmxLogo className="size-6" />
      ) : project.slug === 'codecat' ? (
        <svg viewBox="0 0 24 24" fill="none" className="size-[22px]" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m4 9 1.2-5L10 7h4l4.8-3L20 9v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9Z" />
          <path d="M9 12h.01M15 12h.01M9 16c1.8 1.4 4.2 1.4 6 0" />
        </svg>
      ) : project.slug === 'noiseless' ? (
        <svg viewBox="0 0 24 24" fill="none" className="size-[22px]" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="7.4" />
          <ellipse cx="12" cy="12" rx="10.5" ry="3.5" transform="rotate(-28 12 12)" />
          <circle cx="18.4" cy="8.7" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="size-[22px]" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.8 14.5 9.5 21.2 12l-6.7 2.5L12 21.2l-2.5-6.7L2.8 12l6.7-2.5L12 2.8Z" />
          <circle cx="18.5" cy="5.5" r="1" fill="currentColor" />
        </svg>
      )}
    </span>
  )
}

function StackIcons({ project }: { project: Project }) {
  return (
    <ul aria-label={`${project.name} technology stack`} className="pointer-events-auto flex flex-wrap items-center gap-1.5 sm:gap-2">
      {project.stack.map((name) => (
        <li key={name} aria-label={name} className="group/tech relative rounded-lg outline-none">
          <span
            aria-hidden="true"
            className="flex size-[26px] items-center justify-center rounded-lg border border-border/50 bg-background/75 p-1.5 transition-[transform,border-color,background-color] duration-200 group-hover/tech:scale-110 group-hover/tech:border-border group-hover/tech:bg-background sm:size-7"
          >
            <TechIcon name={name} className="size-full" />
          </span>
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-30 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-medium text-foreground opacity-0 shadow-lg transition duration-150 group-hover/tech:translate-y-0 group-hover/tech:opacity-100"
          >
            {name}
          </span>
        </li>
      ))}
    </ul>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const projectUrl = project.links[0]?.href

  return (
    <ScrollReveal delay={index * 0.07} className={project.wide ? 'md:col-span-2' : undefined}>
      <article className="project-card group relative flex h-full min-w-0 flex-col overflow-visible rounded-[20px] border border-border/50 bg-surface/15 p-[3px] transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-border/90 hover:bg-surface/30">
        <div aria-hidden="true" className={`project-card-glow project-glow-${project.glow}`} />

        <div className="project-media pointer-events-none relative z-10 overflow-hidden rounded-[15px] border border-border/50 bg-surface/30 p-1.5">
          <div className="relative flex min-h-44 items-center justify-center overflow-hidden rounded-[10px] bg-background/60 sm:min-h-52">
            <div aria-hidden="true" className={`project-image-ambient project-glow-${project.glow}`} />
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes={project.wide ? '(max-width: 640px) 100vw, 700px' : '(max-width: 640px) 100vw, 360px'}
              className="project-image object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
            <div aria-hidden="true" className="project-image-glow" />
            <div aria-hidden="true" className="project-image-fade" />
            <span className="project-image-stamp absolute bottom-3 left-3 z-20 max-w-[70%] text-[9px] font-medium uppercase tracking-[0.16em] text-white/80 sm:bottom-4 sm:left-4 sm:text-[10px]">
              {project.stamp}
            </span>
            <span className="project-image-index absolute bottom-3 right-3 z-20 font-mono text-[9px] tracking-[0.1em] text-white/55 sm:bottom-4 sm:right-4">
              0{index + 1} <span className="text-white/30">/ 04</span>
            </span>
            {project.status && (
              <span className="crew-status-badge absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium tracking-wide text-orange-50/95 shadow-lg backdrop-blur-md">
                <span className="project-status-dot size-1.5 animate-pulse rounded-full bg-orange-300 motion-reduce:animate-none" />
                {project.status}
              </span>
            )}
          </div>
        </div>

        <div className="project-card-body pointer-events-none relative z-10 flex min-w-0 flex-1 flex-col px-1 pb-1 pt-4 sm:px-2 sm:pt-5">
          <div className="flex items-center gap-3">
            <ProjectGlyph project={project} />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {project.name}
              </h3>
              <span className="mt-0.5 block truncate text-[10px] font-medium text-muted/85 sm:text-xs">
                {project.eyebrow}
              </span>
            </div>
            <span aria-hidden="true" className="project-open-mark flex size-8 shrink-0 items-center justify-center rounded-full border border-border/40 text-muted transition-[transform,background-color,color,border-color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-foreground/30 group-hover:bg-foreground group-hover:text-background">
              <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted sm:text-sm">
            {project.description}
          </p>
          <div className="mt-4 flex items-end justify-between gap-4 border-t border-border/30 pt-3">
            <StackIcons project={project} />
            {projectUrl ? (
              <a href={projectUrl} target="_blank" rel="noreferrer" className="pointer-events-auto shrink-0 pb-1 text-[9px] font-medium uppercase tracking-[0.13em] text-muted/70 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground">
                Visit project ↗
              </a>
            ) : (
              <span className="shrink-0 pb-1 text-[9px] font-medium uppercase tracking-[0.13em] text-muted/60">In progress</span>
            )}
          </div>
        </div>
      </article>
    </ScrollReveal>
  )
}

export default function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="px-4 pb-12 pt-2 sm:px-6 sm:pb-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Selected work</p>
          <h2 id="projects-heading" className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Things I&apos;m building
          </h2>
        </div>
        <span className="pb-1 text-xs text-muted">01 — 04</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
