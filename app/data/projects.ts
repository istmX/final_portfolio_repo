import type { TechIconName } from '../components/icons'

export type ProjectLink = { label: string; href: string }
export type ProjectSection = {
  title: string
  description: string
  points?: string[]
}

export type Project = {
  slug: string
  name: string
  eyebrow: string
  description: string
  image: string
  imageAlt: string
  stamp: string
  stack: TechIconName[]
  links: ProjectLink[]
  sections: ProjectSection[]
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
      'Crew turns a goal into finished work. A main agent understands the request, plans the steps, delegates to specialists, operates a real computer environment, and brings the result back to you.',
    image: '/Crew.png',
    imageAlt: 'Crew autonomous AI workforce coordinating specialist agents and connected services',
    stamp: 'Give a goal. Get work done.',
    stack: [
      'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel',
      'React Native', 'Expo', 'Python', 'FastAPI', 'LangChain', 'LangGraph',
      'RAG', 'PostgreSQL', 'Neon', 'Qdrant', 'Docker', 'AWS EC2',
    ],
    links: [],
    status: 'Currently building',
    wide: true,
    glow: 'crew',
    sections: [
      {
        title: 'One goal. A coordinated team.',
        description:
          'Talk to one main Crew agent. It can bring in focused agents for research, coding, writing, design, analysis, planning, and computer use while keeping the whole task coordinated.',
        points: ['Researcher', 'Coder', 'Writer', 'Designer', 'Analyst', 'Planner', 'Computer agent', 'Custom agents'],
      },
      {
        title: 'Built to carry work through',
        description:
          'Crew is designed around execution, not just chat. It follows a task through the steps needed to complete it and keeps track of what has happened along the way.',
        points: ['Understand the goal', 'Plan and delegate', 'Execute with tools', 'Observe and update state', 'Continue or complete', 'Deliver the result'],
      },
      {
        title: 'A real computer environment',
        description:
          'Agents can work in their own computer environment on AWS EC2, with a browser, terminal, files, applications, and screenshots. The computer stays separate from the agent runtime so the execution environment can evolve independently.',
        points: ['Browser interaction', 'Terminal access', 'Files and applications', 'Remote AWS EC2 execution'],
      },
      {
        title: 'Fits into the tools you already use',
        description:
          'Crew is designed to work across connected services and bring completed work back into an existing workflow.',
        points: ['Gmail', 'Google Drive and Docs', 'GitHub', 'Slack', 'Notion', 'Google Calendar'],
      },
      {
        title: 'Memory with structure',
        description:
          'Structured application state and semantic memory have separate roles. PostgreSQL holds task and product state, while Qdrant can retrieve relevant context from previous research, documents, and artifacts.',
        points: ['PostgreSQL for structured state', 'Qdrant for vector retrieval', 'RAG for relevant context'],
      },
    ],
  },
  {
    slug: 'istmx-skills',
    name: 'ISTMX Skills',
    eyebrow: '@istmx/skills · 1,000+ npm downloads',
    description:
      'A deterministic, stack-agnostic workflow toolkit that helps coding agents plan, design, build, review, and ship software with reusable engineering practices.',
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
    sections: [
      {
        title: 'A router for agent workflows',
        description:
          'The `/istm` command reads a task, identifies the work involved, and routes it to a matching specialist workflow. Architecture and design can be established before implementation begins.',
        points: ['Architecture and system design', 'Design system and interface work', 'Animation and interaction', 'Prompt routing and orchestration'],
      },
      {
        title: 'A toolkit for the full development cycle',
        description:
          'ISTMX Skills includes repeatable workflows for planning and implementing features, debugging, browser QA, security review, performance improvements, code review, testing, and releases.',
        points: ['Plan and develop', 'Debug and test', 'Automated browser QA with Playwright', 'Security and performance review', 'Review and release'],
      },
      {
        title: '70+ production design presets',
        description:
          'Preset design blueprints provide a starting point for colors, type, spacing, component rules, and motion, so interfaces can follow a coherent visual system instead of generic defaults.',
      },
      {
        title: 'Use it with your coding environment',
        description:
          'The initializer detects supported agent harnesses and installs the workflow instructions into the project environment.',
        points: ['Claude Code', 'Cursor', 'Windsurf', 'Gemini', 'Cline', 'Roo Code'],
      },
    ],
  },
  {
    slug: 'codecat',
    name: 'CodeCat',
    eyebrow: 'AI code review',
    description:
      'CodeCat reviews code, explains potential problems, and suggests fixes. Multiple model providers with fallback support help keep reviews available when a provider is unavailable.',
    image: '/codecat.png',
    imageAlt: 'CodeCat AI code review interface and specialist review agents',
    stamp: 'Review · Explain · Improve',
    stack: ['Vercel AI SDK', 'Next.js', 'Neon', 'TypeScript', 'Tailwind CSS', 'Auth.js'],
    links: [
      { label: 'Live project', href: 'https://codecat-ten.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/istmX/codecat' },
    ],
    glow: 'codecat',
    sections: [
      {
        title: 'Review feedback you can act on',
        description:
          'CodeCat identifies potential problems, explains why they matter, and suggests changes so developers can understand and address issues in context.',
        points: ['Find potential bugs and risks', 'Explain findings clearly', 'Suggest practical fixes'],
      },
      {
        title: 'Resilient model access',
        description:
          'A multi-provider fallback architecture lets the review flow continue when its primary AI provider is unavailable.',
      },
    ],
  },
  {
    slug: 'noiseless',
    name: 'Noiseless',
    eyebrow: 'Autonomous research',
    description:
      'Noiseless continuously monitors topics you care about, finds meaningful changes, and delivers focused research digests on a schedule you choose.',
    image: '/noiseless.png',
    imageAlt: 'Noiseless research product showing its signal-focused interface',
    stamp: 'Less noise. More signal.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Neon', 'Python', 'FastAPI', 'LangChain', 'Slack'],
    links: [
      { label: 'Live project', href: 'https://noiseless-gold.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/istmX/Noiseless' },
    ],
    wide: true,
    glow: 'noiseless',
    sections: [
      {
        title: 'Research that keeps watch',
        description:
          'Set a topic and a cadence. Noiseless monitors for updates, investigates what changed, and filters the results into a useful summary instead of asking you to repeat the same research manually.',
        points: ['Choose topics to follow', 'Set a monitoring frequency', 'Receive focused digests'],
      },
      {
        title: 'Delivered where you work',
        description:
          'Noiseless can connect with services such as Gmail and Slack, so research updates can arrive inside your existing workflow.',
        points: ['Gmail', 'Slack'],
      },
    ],
  },
]

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug)
}
