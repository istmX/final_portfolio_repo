import Image from 'next/image'
import { PROJECTS, type Project } from './projectData'
import ScrollReveal from './ScrollReveal'
import { TechIcon } from './icons'

function ProjectArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

function ProjectTechnologies({ project }: { project: Project }) {
  return (
    <ul aria-label={`${project.name} technologies: ${project.metadata}`} className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      {project.technologies.map((technology) => (
        <li key={technology} tabIndex={0} aria-label={technology} className="project-tech group/tech relative flex size-7 items-center justify-center rounded-lg border border-border/50 bg-background/75 p-1.5 outline-none transition-[border-color,background-color,transform] duration-150 hover:-translate-y-px hover:border-border hover:bg-background focus-visible:border-border focus-visible:bg-background sm:size-8">
          <TechIcon name={technology} className="size-full" />
          <span role="tooltip" className="pointer-events-none absolute bottom-[calc(100%+7px)] left-1/2 z-30 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-medium text-foreground opacity-0 shadow-lg transition duration-150 group-hover/tech:translate-y-0 group-hover/tech:opacity-100 group-focus/tech:translate-y-0 group-focus/tech:opacity-100">
            {technology}
          </span>
        </li>
      ))}
    </ul>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const projectLink = project.links[0]

  return (
    <ScrollReveal delay={index * 0.07} className={project.wide ? 'sm:col-span-2' : undefined}>
      <article className="project-card group relative flex h-full min-w-0 flex-col rounded-[20px] border border-border/50 bg-surface/15 p-1 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-px hover:border-border/80 hover:bg-surface/25">
        <div className="project-media relative rounded-[15px] border border-border/35 bg-background/35 p-[2px]">
          <div className="project-media-inner relative flex min-h-48 items-center justify-center overflow-hidden rounded-[12px] border border-border/40 bg-background/55 p-4 sm:min-h-56 sm:p-5 lg:min-h-60">
            <div aria-hidden="true" className={`project-image-glow project-glow-${project.glow}`} />
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes={project.wide ? '(max-width: 640px) 100vw, 700px' : '(max-width: 640px) 100vw, 360px'}
              className="project-image relative z-10 rounded-[10px] object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-[1.01]"
            />
            {projectLink && (
              <a
                href={projectLink.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${project.name}`}
                className="absolute inset-0 z-20 cursor-pointer rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-foreground"
              />
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col px-3 pb-3 pt-4 sm:px-4 sm:pt-5">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-[10px] tracking-wide text-muted/65">0{index + 1}</span>
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">{project.name}</h3>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 pl-[2.2rem]">
                <span className="text-[10px] font-medium text-muted/85 sm:text-xs">{project.eyebrow}</span>
                {project.qualifier && <span className="rounded-md border border-border/50 bg-surface/45 px-1.5 py-0.5 text-[9px] font-medium text-foreground/75 sm:text-[10px]">{project.qualifier}</span>}
                {project.status && <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-muted/65">{project.status}</span>}
              </div>
            </div>
            {projectLink && (
              <a
                href={projectLink.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${project.name}`}
                className="mt-1 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
              >
                <span>{projectLink.label === 'Website' ? 'Visit website' : 'Visit project'}</span>
                <ProjectArrow />
              </a>
            )}
          </header>
          <p className="mt-3 text-[13px] leading-6 text-muted sm:text-sm">{project.description}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-border/30 pt-3">
            <span className="sr-only">{project.metadata}</span>
            <ProjectTechnologies project={project} />
          </div>
        </div>
      </article>
    </ScrollReveal>
  )
}

export default function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="border-b border-dotted border-border/50 px-8 pb-12 pt-2 sm:px-8 sm:pb-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Selected work</p>
          <h2 id="projects-heading" className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Products, tools &amp; experiments
          </h2>
          <p className="mt-2 text-xs leading-5 text-muted sm:text-sm">
            A few things I&apos;ve built around AI, developer workflows, and getting useful work done.
          </p>
        </div>
        <span className="pb-1 text-xs text-muted">01 — 04</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {PROJECTS.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
      </div>
    </section>
  )
}
