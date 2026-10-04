import type { TechIconName } from './icons'

export type Project = {
  slug: string
  name: string
  eyebrow: string
  description: string
  image: string
  imageAlt: string
  stamp: string
  stack: TechIconName[]
  links: { label: string; href: string }[]
  glow: 'crew' | 'skills' | 'codecat' | 'noiseless'
  wide?: boolean
  status?: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'crew',
    name: 'Crew',
    eyebrow: 'Autonomous AI workforce',
    description:
      'Give one agent a goal and it can plan the work, delegate to specialists, use tools and a remote computer, then bring the result back.',
    image: '/Crew.png',
    imageAlt: 'Crew autonomous AI workforce coordinating specialist agents and connected services',
    stamp: 'Give a goal. Get work done.',
    stack: ['Next.js', 'TypeScript', 'Python', 'LangGraph', 'PostgreSQL', 'Qdrant', 'AWS EC2'],
    links: [],
    status: 'Currently building',
    wide: true,
    glow: 'crew',
  },
  {
    slug: 'istmx-skills',
    name: 'ISTMX Skills',
    eyebrow: '@istmx/skills · 1,000+ npm downloads',
    description:
      'A reusable workflow toolkit that helps coding agents plan, build, review, and ship software with structured engineering practices.',
    image: '/istm.png',
    imageAlt: 'ISTMX Skills website showing the agentic development toolkit',
    stamp: 'A system for your coding agents',
    stack: ['JavaScript'],
    links: [
      { label: 'Website', href: 'https://istmx.dpdns.org/' },
      { label: 'Documentation', href: 'https://istmx.dpdns.org/docs' },
      { label: 'GitHub', href: 'https://github.com/istmX/skills' },
      { label: 'npm package', href: 'https://www.npmjs.com/package/@istmx/skills' },
    ],
    glow: 'skills',
  },
  {
    slug: 'codecat',
    name: 'CodeCat',
    eyebrow: 'AI code review',
    description:
      'Get clear explanations of potential code issues and practical fixes, with provider fallback to keep reviews available.',
    image: '/codecat.png',
    imageAlt: 'CodeCat AI code review interface and specialist review agents',
    stamp: 'Review · Explain · Improve',
    stack: ['Vercel AI SDK', 'Next.js', 'Neon', 'TypeScript', 'Auth.js'],
    links: [
      { label: 'Live project', href: 'https://codecat-ten.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/istmX/codecat' },
    ],
    glow: 'codecat',
  },
  {
    slug: 'noiseless',
    name: 'Noiseless',
    eyebrow: 'Autonomous research',
    description:
      'Follow topics on a schedule and get focused digests of meaningful updates, delivered through tools like Slack and Gmail.',
    image: '/noiseless.png',
    imageAlt: 'Noiseless research product showing its signal-focused interface',
    stamp: 'Less noise. More signal.',
    stack: ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'LangChain', 'Slack'],
    links: [
      { label: 'Live project', href: 'https://noiseless-gold.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/istmX/Noiseless' },
    ],
    wide: true,
    glow: 'noiseless',
  },
]
