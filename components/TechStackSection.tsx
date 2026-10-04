import TechStackPills from './TechStackPills'
import type { TechIconName } from './icons'

const TECHNOLOGIES: TechIconName[] = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Next.js', 'Tailwind CSS',
  'Node.js', 'Express', 'FastAPI', 'Pydantic', 'React Native', 'Expo',
  'GSAP', 'Lenis', 'Motion', 'MongoDB', 'PostgreSQL', 'Firebase', 'Neon', 'Qdrant',
  'LangChain', 'LangGraph', 'RAG', 'Prisma', 'SQLAlchemy',
  'Docker', 'AWS', 'Vercel', 'Git', 'GitHub',
]

export default function TechStackSection() {
  return (
    <section id="tech-stack" aria-labelledby="tech-stack-heading" className="border-t border-dotted border-border/50 px-8 pb-8 pt-7 sm:px-8 sm:pb-10 sm:pt-8">
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Tech stack</p>
        <h2 id="tech-stack-heading" className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Technologies I use
        </h2>
      </div>
      <TechStackPills technologies={TECHNOLOGIES} />
    </section>
  )
}
