import type { TechIconName } from './icons'

export type Project = {
  slug: string
  name: string
  eyebrow: string
  qualifier?: string
  description: string
  image: string
  imageAlt: string
  metadata: string
  technologies: TechIconName[]
  links: { label: string; href: string }[]
  wide?: boolean
  status?: string
  glow: 'crew' | 'skills' | 'codecat' | 'noiseless'
}

export const PROJECTS: Project[] = [
  {
    slug: 'crew',
    name: 'Crew',
    eyebrow: 'Autonomous AI agent platform',
    qualifier: '(web and mobile app)',
    description:
      'An independent AI agent platform for creating and running multiple agents that work on their own cloud computers. Assign them tasks and let them use tools, browse the web, work with files, and collaborate to get the work done.',
    image: '/Crew.png',
    imageAlt: 'Crew autonomous AI workforce coordinating agents and connected services',
    metadata: 'Next.js · React · TypeScript · Tailwind CSS · Vercel · React Native · Expo · Python · FastAPI · LangChain · LangGraph · RAG · Multi-agent execution · PostgreSQL · Neon · Qdrant · Docker · AWS ',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'React Native', 'Expo', 'Python', 'FastAPI', 'LangChain', 'LangGraph', 'RAG', 'Multi-agent execution', 'PostgreSQL', 'Neon', 'Qdrant', 'Docker', 'AWS '],
    links: [],
    status: 'In development',
    wide: true,
    glow: 'crew',
  },
  {
    slug: 'istmx-skills',
    name: 'ISTMX Skills',
    eyebrow: 'Developer workflow toolkit',
    description:
      'A collection of reusable skills and structured workflows for AI coding agents, helping them understand projects, follow engineering practices, and produce more consistent results.',
    image: '/istm.png',
    imageAlt: 'ISTMX Skills website showing reusable workflows for AI coding agents',
    metadata: 'JavaScript · NPM',
    technologies: ['JavaScript', 'NPM'],
    links: [
      { label: 'Website', href: 'https://istmx.dpdns.org/' },
      { label: 'Documentation', href: 'https://istmx.dpdns.org/docs' },
      { label: 'GitHub', href: 'https://github.com/istmX/skills' },
      { label: 'npm package', href: 'https://www.npmjs.com/package/@istmx/skills' },
    ],
    status: 'Open source',
    glow: 'skills',
  },
  {
    slug: 'codecat',
    name: 'CodeCat',
    eyebrow: 'AI code review platform',
    description:
      'An AI-powered code review platform that analyzes your code, finds potential issues, explains what went wrong, and helps you understand and improve your implementation.',
    image: '/codecat.png',
    imageAlt: 'CodeCat AI code review interface',
    metadata: 'Next.js · TypeScript · Tailwind CSS · Vercel AI SDK · Neon · Prisma · Auth.js',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel AI SDK', 'Neon', 'Prisma', 'Auth.js'],
    links: [
      { label: 'Live project', href: 'https://codecat-ten.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/istmX/codecat' },
    ],
    glow: 'codecat',
  },
  {
    slug: 'noiseless',
    name: 'Noiseless',
    eyebrow: 'Autonomous research agent',
    description:
      'An autonomous research agent that follows topics you care about, searches for new information, filters out the noise, and delivers useful updates through scheduled digests, Slack, and Gmail.',
    image: '/noiseless.png',
    imageAlt: 'Noiseless research product interface',
    metadata: 'Next.js · TypeScript · Tailwind CSS · Neon · Python · FastAPI · LangChain · Slack',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Neon', 'Python', 'FastAPI', 'LangChain', 'Slack'],
    links: [
      { label: 'Live project', href: 'https://noiseless-gold.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/istmX/Noiseless' },
    ],
    wide: true,
    glow: 'noiseless',
  },
]
