import {
  siDocker,
  siExpo,
  siExpress,
  siFastapi,
  siJavascript,
  siLangchain,
  siLanggraph,
  siNeon,
  siNextdotjs,
  siPostgresql,
  siPython,
  siQdrant,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from 'simple-icons'
import Image from 'next/image'
import type { SVGProps } from 'react'

const TECH_ICONS = {
  'Next.js': siNextdotjs,
  React: siReact,
  'React Native': siReact,
  TypeScript: siTypescript,
  'Tailwind CSS': siTailwindcss,
  Expo: siExpo,
  Python: siPython,
  LangChain: siLangchain,
  LangGraph: siLanggraph,
  RAG: null,
  PostgreSQL: siPostgresql,
  Neon: siNeon,
  Qdrant: siQdrant,
  Docker: siDocker,
  AWS: null,
  Vercel: siVercel,
  JavaScript: siJavascript,
  'Vercel AI SDK': siVercel,
  'Auth.js': null,
  FastAPI: siFastapi,
  Slack: null,
  Motion: null,
  'Express.js': siExpress,
} satisfies Record<string, SimpleIcon | null>

export type TechIconName = keyof typeof TECH_ICONS

type TechIconProps = SVGProps<SVGSVGElement> & { name: TechIconName }

function UtilityIcon({ name, ...props }: TechIconProps) {
  if (name === 'RAG') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <path d="M4 6c0 1.657 3.582 3 8 3s8-1.343 8-3s-3.582-3-8-3s-8 1.343-8 3" />
        <path d="M4 6v6c0 1.657 3.582 3 8 3m8-3.5v-5.5M4 12v6c0 1.657 3.582 3 8 3m3-3a3 3 0 1 0 6 0a3 3 0 0 0-6 0m5.2 2.2 1.8 1.8" />
      </svg>
    )
  }

  if (name === 'Auth.js') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6Z" />
        <path d="M8 11V7a4 4 0 1 1 8 0v4m-4 5v1" />
      </svg>
    )
  }

  if (name === 'Slack') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
        <path d="M12 12V6a2 2 0 0 1 4 0v6m0-2a2 2 0 1 1 2 2h-6" />
        <path d="M12 12h6a2 2 0 0 1 0 4h-6m2 0a2 2 0 1 1-2 2v-6" />
        <path d="M12 12v6a2 2 0 0 1-4 0v-6m0 2a2 2 0 1 1-2-2h6" />
        <path d="M12 12H6a2 2 0 0 1 0-4h6m-2 0a2 2 0 1 1 2-2v6" />
      </svg>
    )
  }

  if (name === 'Motion') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path d="M3 18.5 9.4 5.5h4.2L7.2 18.5H3Z" fill="#7C3AED" />
        <path d="M10.1 18.5 16.5 5.5h4.2l-6.4 13h-4.2Z" fill="#A78BFA" />
        <path d="M15.7 18.5 19.4 11h2.6l-3.7 7.5h-2.6Z" fill="#DDD6FE" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M16 18a2 2 0 0 1 2 2 2 2 0 0 1 2-2 2 2 0 0 1-2-2 2 2 0 0 1-2 2m0-12a2 2 0 0 1 2 2 2 2 0 0 1 2-2 2 2 0 0 1-2-2 2 2 0 0 1-2 2m-7 12a6 6 0 0 1 6-6 6 6 0 0 1-6-6 6 6 0 0 1-6 6 6 6 0 0 1 6 6" />
    </svg>
  )
}

export function TechIcon({ name, className, style, ...props }: TechIconProps) {
  if (name === 'AWS') {
    return (
      <Image
        src="/tech-icons/aws.svg"
        alt=""
        width={48}
        height={28}
        unoptimized
        className={`${className ?? ''} object-contain`}
        style={style}
      />
    )
  }

  const icon = TECH_ICONS[name]

  if (!icon) {
    return <UtilityIcon name={name} className={className} style={style} {...props} />
  }

  const vercel = name === 'Vercel' || name === 'Vercel AI SDK'
  const monochrome = name === 'Next.js' || name === 'Express.js'

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ color: vercel ? '#111827' : monochrome ? 'var(--foreground)' : `#${icon.hex}`, ...style }}
      {...props}
    >
      <path d={icon.path} />
    </svg>
  )
}

export { TECH_ICONS }
