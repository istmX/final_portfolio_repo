import Image from 'next/image'
import { IconArrowUpRight } from '@tabler/icons-react'
import { PROJECTS, type Project } from './projectData'
import ScrollReveal from './ScrollReveal'
import { TechIcon } from './icons'
import { GlowingEffect } from '@/app/portfolio-components/ui/glowing-effect'

const PROJECT_GLOWS: Record<Project['glow'], string> = {
  crew: 'radial-gradient(ellipse at 32% 42%, rgb(249 115 22 / 34%), transparent 55%), radial-gradient(ellipse at 72% 58%, rgb(99 102 241 / 27%), transparent 58%), radial-gradient(ellipse at center, rgb(56 189 248 / 12%), transparent 72%)',
  skills:
    'radial-gradient(ellipse at 34% 48%, rgb(56 189 248 / 32%), transparent 54%), radial-gradient(ellipse at 70% 52%, rgb(99 102 241 / 27%), transparent 58%), radial-gradient(ellipse at center, rgb(45 212 191 / 12%), transparent 72%)',
  codecat:
    'radial-gradient(ellipse at 34% 44%, rgb(139 92 246 / 34%), transparent 55%), radial-gradient(ellipse at 70% 56%, rgb(59 130 246 / 28%), transparent 58%), radial-gradient(ellipse at center, rgb(236 72 153 / 12%), transparent 72%)',
  noiseless:
    'radial-gradient(ellipse at 32% 46%, rgb(16 185 129 / 30%), transparent 54%), radial-gradient(ellipse at 70% 56%, rgb(56 189 248 / 27%), transparent 58%), radial-gradient(ellipse at center, rgb(163 230 53 / 10%), transparent 72%)',
}

function ProjectTechnologies({ project }: { project: Project }) {
  return (
    <ul
      aria-label={`${project.name} technologies: ${project.metadata}`}
      className="flex flex-wrap items-center gap-1.5 sm:gap-2"
    >
      {project.technologies.map((technology) => (
        <li
          key={technology}
          tabIndex={0}
          aria-label={technology}
          className="group/tech border-border/50 bg-background/75 hover:border-border hover:bg-background focus-visible:border-border focus-visible:bg-background relative flex size-7 items-center justify-center rounded-lg border p-1.5 transition-[border-color,background-color,transform] duration-150 outline-none hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:size-8"
        >
          <TechIcon name={technology} className="size-full" />
          <span
            role="tooltip"
            className="border-border bg-surface text-foreground pointer-events-none absolute bottom-[calc(100%+7px)] left-1/2 z-30 -translate-x-1/2 translate-y-1 rounded-md border px-2 py-1 text-[10px] font-medium whitespace-nowrap opacity-0 shadow-lg transition duration-150 group-hover/tech:translate-y-0 group-hover/tech:opacity-100 group-focus/tech:translate-y-0 group-focus/tech:opacity-100"
          >
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
    <ScrollReveal
      delay={index * 0.07}
      className={project.wide ? 'sm:col-span-2' : undefined}
    >
      <article className="group border-border/50 bg-surface/15 hover:border-border/80 hover:bg-surface/25 relative flex h-full min-w-0 flex-col rounded-[20px] border p-1 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <div className="project-media border-border/35 bg-background/35 relative isolate rounded-[15px] border p-[2px]">
          <GlowingEffect
            spread={36}
            proximity={54}
            inactiveZone={0.5}
            disabled={false}
          />
          <div className="project-media-inner border-border/40 bg-background/55 relative flex min-h-48 items-center justify-center overflow-hidden rounded-[12px] border p-4 sm:min-h-56 sm:p-5 lg:min-h-60">
            <div
              aria-hidden="true"
              style={{ background: PROJECT_GLOWS[project.glow] }}
              className="pointer-events-none absolute inset-[8%] z-0 scale-[0.88] rounded-full opacity-0 blur-[24px] transition-[opacity,transform] duration-[350ms,450ms] ease-out group-focus-within:scale-[1.08] group-focus-within:opacity-100 group-hover:scale-[1.08] group-hover:opacity-100 motion-reduce:transition-none"
            />
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes={
                project.wide
                  ? '(max-width: 640px) 100vw, 700px'
                  : '(max-width: 640px) 100vw, 360px'
              }
              className="relative z-10 rounded-[10px] object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-[1.01] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            {projectLink && (
              <a
                href={projectLink.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${project.name}`}
                className="focus-visible:outline-foreground absolute inset-0 z-20 cursor-pointer rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-[-4px]"
              />
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col px-3 pt-4 pb-3 sm:px-4 sm:pt-5">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2.5">
                <span className="text-muted/65 font-mono text-[10px] tracking-wide">
                  0{index + 1}
                </span>
                <h3 className="font-display text-foreground text-lg font-semibold tracking-tight sm:text-xl">
                  {project.name}
                </h3>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 pl-[2.2rem]">
                <span className="text-muted/85 text-[10px] font-medium sm:text-xs">
                  {project.eyebrow}
                </span>
                {project.qualifier && (
                  <span className="border-border/50 bg-surface/45 text-foreground/75 rounded-md border px-1.5 py-0.5 text-[9px] font-medium sm:text-[10px]">
                    {project.qualifier}
                  </span>
                )}
                {project.status && (
                  <span className="text-muted/65 text-[9px] font-medium tracking-[0.12em] uppercase">
                    {project.status}
                  </span>
                )}
              </div>
            </div>
            {projectLink && (
              <a
                href={projectLink.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${project.name}`}
                className="text-muted hover:text-foreground focus-visible:outline-foreground mt-1 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-[9px] font-medium tracking-[0.1em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-3"
              >
                <span>
                  {projectLink.label === 'Website'
                    ? 'Visit website'
                    : 'Visit project'}
                </span>
                <IconArrowUpRight size={16} stroke={1.7} aria-hidden="true" />
              </a>
            )}
          </header>
          <p className="text-muted mt-3 text-[13px] leading-6 sm:text-sm">
            {project.description}
          </p>
          <div className="border-border/30 mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t pt-3">
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
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-border/50 border-b border-dotted px-8 pt-2 pb-12 sm:px-8 sm:pb-16"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-muted text-[10px] font-medium tracking-[0.18em] uppercase">
            Selected work
          </p>
          <h2
            id="projects-heading"
            className="font-display mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Products, tools &amp; experiments
          </h2>
          <p className="text-muted mt-2 text-xs leading-5 sm:text-sm">
            A few things I&apos;ve built around AI, developer workflows, and
            getting useful work done.
          </p>
        </div>
        <span className="text-muted pb-1 text-xs">01 — 04</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
