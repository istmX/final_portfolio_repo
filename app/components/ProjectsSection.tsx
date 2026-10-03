import Image from 'next/image'

type StackItem = { name: string; mark: string; color: string }

type Project = {
  name: string
  eyebrow: string
  description: string
  image?: string
  imageAlt?: string
  stack: StackItem[]
  href?: string
  featured?: boolean
  kind: 'crew' | 'image'
}

const PROJECTS: Project[] = [
  {
    name: 'Crew',
    eyebrow: 'In progress · AI workforce',
    description:
      'An AI workforce that turns a goal into finished work. Crew plans, delegates to specialist agents, and gives them tools and a real computer environment to get things done.',
    stack: [
      { name: 'Next.js', mark: 'N', color: 'text-foreground' },
      { name: 'TypeScript', mark: 'TS', color: 'text-[#3178c6]' },
      { name: 'Python', mark: 'Py', color: 'text-[#3776ab]' },
      { name: 'LangGraph', mark: 'LG', color: 'text-[#e15744]' },
      { name: 'PostgreSQL', mark: 'P', color: 'text-[#699eca]' },
      { name: 'AWS', mark: 'A', color: 'text-[#f59e0b]' },
    ],
    featured: true,
    kind: 'crew',
  },
  {
    name: 'ISTMX Skills',
    eyebrow: '@istmx/skills · 1,000+ npm downloads',
    description:
      'A stack-agnostic toolkit that gives coding agents repeatable architecture, design, implementation, and QA workflows, with 70+ production design presets.',
    image: '/istm.png',
    imageAlt: 'ISTMX Skills product website',
    href: 'https://istmx.dpdns.org',
    stack: [
      { name: 'Claude Code', mark: '✳', color: 'text-[#d99470]' },
      { name: 'Cursor', mark: 'Cu', color: 'text-[#b4a4ff]' },
      { name: 'Windsurf', mark: 'W', color: 'text-[#71cfff]' },
      { name: 'Gemini', mark: '✦', color: 'text-[#8eb5ff]' },
    ],
    kind: 'image',
  },
  {
    name: 'CodeCat',
    eyebrow: 'AI code review',
    description:
      'An AI-powered code review platform that spots potential issues, explains them clearly, and suggests fixes with a multi-provider fallback architecture.',
    image: '/codecat.png',
    imageAlt: 'CodeCat AI code review product',
    stack: [
      { name: 'Next.js', mark: 'N', color: 'text-foreground' },
      { name: 'Vercel AI SDK', mark: 'V', color: 'text-foreground' },
      { name: 'Neon', mark: 'Ne', color: 'text-[#54c69b]' },
      { name: 'Prisma', mark: 'P', color: 'text-[#6f83a3]' },
    ],
    kind: 'image',
  },
  {
    name: 'Noiseless',
    eyebrow: 'Autonomous research',
    description:
      'A research agent that keeps watch on chosen topics, filters for meaningful changes, and delivers scheduled digests through services like Gmail and Slack.',
    image: '/noiseless.png',
    imageAlt: 'Noiseless autonomous research product',
    stack: [
      { name: 'AI agents', mark: '✳', color: 'text-[#52d4a6]' },
      { name: 'Gmail', mark: 'G', color: 'text-[#ea7165]' },
      { name: 'Slack', mark: 'S', color: 'text-[#a77bd4]' },
      { name: 'Scheduled digests', mark: '↗', color: 'text-[#35ad91]' },
    ],
    kind: 'image',
  },
]

function StackIcons({ items }: { items: StackItem[] }) {
  return (
    <ul aria-label="Tools and integrations" className="flex items-center gap-2">
      {items.map((item) => (
        <li key={item.name} tabIndex={0} aria-label={item.name} className="group relative rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-foreground/40">
          <span
            aria-hidden="true"
            className={`flex size-7 items-center justify-center rounded-lg border border-border/50 bg-background/70 text-[10px] font-bold tracking-tight ${item.color}`}
          >
            {item.mark}
          </span>
          <span
            role="tooltip"
            id={`project-tech-${item.name.toLowerCase().replaceAll(' ', '-')}`}
            className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-30 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-[10px] font-medium text-foreground opacity-0 shadow-lg transition duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
          >
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  )
}

function CrewPreview() {
  return (
    <div className="crew-preview relative flex h-full min-h-44 items-center justify-center overflow-hidden rounded-[13px] bg-neutral-950 px-5 py-6 sm:min-h-52">
      <div aria-hidden="true" className="crew-orbit crew-orbit-one" />
      <div aria-hidden="true" className="crew-orbit crew-orbit-two" />
      <div className="relative z-10 w-full max-w-[390px] rounded-xl border border-white/10 bg-neutral-900/90 p-3 shadow-2xl shadow-black/50 backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1 sm:p-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold text-white">C</span>
            <span className="text-xs font-medium text-white/90">Crew workspace</span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Working
          </span>
        </div>
        <div className="space-y-2.5 py-3">
          <div className="max-w-[80%] rounded-lg rounded-tl-sm bg-white/8 px-3 py-2 text-[11px] leading-4 text-white/80">
            Research the latest agent memory approaches and write a summary.
          </div>
          <div className="ml-auto flex max-w-[91%] items-start gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-violet-400/15 text-[9px] text-violet-200">✳</span>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-white/80">Crew is coordinating 3 agents</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Researcher', 'Analyst', 'Writer'].map((agent, index) => (
                  <span key={agent} className="rounded-md border border-white/10 bg-white/5 px-1.5 py-1 text-[9px] text-white/55">
                    <span className={index === 0 ? 'text-emerald-300' : 'text-white/35'}>●</span> {agent}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-white/10 pt-2.5 text-[9px] text-white/40">
          <span className="size-1.5 rounded-full bg-emerald-400" /> Plan · delegate · execute · deliver
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(124,58,237,0.16),transparent_55%)] opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  )
}

function ProjectMedia({ project }: { project: Project }) {
  return (
    <div className="project-media relative overflow-hidden rounded-[13px] border border-border/50 bg-surface/30 p-1.5">
      <div className="relative flex min-h-44 items-center justify-center overflow-hidden rounded-[9px] bg-background/60 sm:min-h-52">
        {project.kind === 'crew' ? (
          <CrewPreview />
        ) : (
          <>
            <Image
              src={project.image!}
              alt={project.imageAlt ?? ''}
              fill
              sizes="(max-width: 640px) 100vw, 700px"
              className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
            <div aria-hidden="true" className="project-image-glow" />
          </>
        )}
        <div aria-hidden="true" className="project-radial-glow" />
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const content = (
    <>
      <ProjectMedia project={project} />
      <div className="flex flex-1 flex-col px-1 pb-1 pt-4 sm:px-2">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {project.name}
          </h3>
          <span className="pt-1 text-[10px] font-medium text-muted sm:text-xs">
            {project.eyebrow}
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          {project.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <StackIcons items={project.stack} />
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${project.name}`}
              className="rounded-sm text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              ↗
            </a>
          )}
        </div>
      </div>
    </>
  )

  const className = `project-card group relative flex min-w-0 flex-col rounded-[18px] border border-border/45 p-[3px] transition-colors duration-300 hover:border-border/90 ${project.featured || project.name === 'Noiseless' ? 'sm:col-span-2' : ''}`

  return <article className={className}>{content}</article>
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
        {PROJECTS.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  )
}
