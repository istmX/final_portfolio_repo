import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function NextJsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" fill="#fff" />
      <path d="M7.5 17V7h1.8l6.2 7.2V7h1.8v10h-1.8L9.3 9.8V17H7.5Z" fill="#09090b" />
      <path d="m14.1 14.6 2.3 2.4h2.2l-3.6-3.8-.9 1.4Z" fill="#09090b" />
    </svg>
  )
}

export function TypeScriptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect width="24" height="24" rx="4" fill="#3178c6" />
      <path fill="#fff" d="M13.1 12.2h3.5V14h-1v5h-2v-5h-1v-1.8h.5Zm-7 1.3c.5-.9 1.2-1.4 2.5-1.4 1 0 1.8.3 2.4.8l-1 1.4c-.4-.3-.9-.6-1.5-.6-.4 0-.7.2-.7.5 0 .4.4.5 1.2.8 1.3.4 2 .9 2 2.1 0 1.4-1.1 2.2-2.7 2.2-1.2 0-2.3-.4-3-1.2l1.1-1.3c.5.5 1.1.8 1.8.8.5 0 .8-.2.8-.5 0-.4-.3-.5-1.1-.8-1.4-.5-2.1-1.1-2.1-2.2 0-.2.1-.4.3-.6Z" />
    </svg>
  )
}

export function ReactIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g stroke="#61dafb" strokeWidth="1.4">
        <ellipse cx="12" cy="12" rx="10" ry="3.9" />
        <ellipse cx="12" cy="12" rx="10" ry="3.9" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="3.9" transform="rotate(120 12 12)" />
      </g>
      <circle cx="12" cy="12" r="1.8" fill="#61dafb" />
    </svg>
  )
}

export function ExpoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 2.5c2.2 0 6.8 13.7 6.8 17.3 0 1.1-1.1 1.7-2.4 1.7-1.8 0-3.1-1.5-4.4-1.5s-2.6 1.5-4.4 1.5c-1.3 0-2.4-.6-2.4-1.7C5.2 16.2 9.8 2.5 12 2.5Z" fill="#111827" />
      <path d="M12 5.6c-1.3 3.2-3.8 9.9-4.4 13.4.7 0 2.1-1 4.4-1s3.7 1 4.4 1C15.8 15.5 13.3 8.8 12 5.6Z" fill="#fff" />
    </svg>
  )
}

export function RagIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 3.5h8l4 4v13H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" stroke="#9a7bff" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3.8v4h4M8 12h7M8 15h4" stroke="#9a7bff" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17.4" cy="17.2" r="3" fill="#17111f" stroke="#d4bfff" strokeWidth="1.4" />
      <path d="m19.6 19.4 2 2" stroke="#d4bfff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function PostgresIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 6.5c1.2-2 4-2.7 7-2.7s5.8.7 7 2.7v6.2c0 2.8-2.4 5.2-5.1 5.2H9.9c-2.7 0-4.9-2.1-4.9-4.8V6.5Z" fill="#336791" />
      <path d="M7.3 7.8c.7-1.1 2.2-1.4 3.4-.7v3.5c-1.2-.5-2.7-.2-3.4.7V7.8Zm9.4 0c-.7-1.1-2.2-1.4-3.4-.7v3.5c1.2-.5 2.7-.2 3.4.7V7.8Z" fill="#fff" />
      <path d="M8 13.1h8m-6.7 3.3v2.1m5.4-2.1v2.1" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="9.4" cy="8.5" r=".6" fill="#336791" />
      <circle cx="14.6" cy="8.5" r=".6" fill="#336791" />
    </svg>
  )
}

export function QdrantIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="#dc244c" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" stroke="#dc244c" strokeWidth="2" />
      <path d="m17.8 17.8 3.1 3.1" stroke="#dc244c" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1" fill="#ff9d5c" />
    </svg>
  )
}

export function DockerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M2.5 12.8h15.8c-.3 4.1-3 7.1-7.2 7.1-4 0-7.4-2.4-8.6-7.1Z" fill="#2496ed" />
      <path d="M5.2 9.3h2.5v2.5H5.2zM8.2 9.3h2.5v2.5H8.2zM11.2 9.3h2.5v2.5h-2.5zM8.2 6.3h2.5v2.5H8.2zM11.2 6.3h2.5v2.5h-2.5zM14.2 9.3h2.5v2.5h-2.5z" fill="#fff" />
      <path d="M18.5 10.1c1.2-.9 2.6-.8 3.3-.3-.2 1-1 1.8-2.2 2.1-.5.1-1 .1-1.6-.1" fill="#2496ed" />
    </svg>
  )
}

export function AwsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6.3 16.7h11.2a3.4 3.4 0 0 0 .3-6.8 5.8 5.8 0 0 0-10.9-.7 3.8 3.8 0 0 0-.6 7.5Z" fill="#f59e0b" />
      <path d="M6 19c4.2 2.3 8.6 2.3 12.3.1" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m17.7 18.7.9.2-.4 1" stroke="#f59e0b" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TailwindIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 5.5c-2.7 0-4.4 1.3-5.1 3.8 1-.9 2.1-1.2 3.4-.9.7.2 1.2.7 1.8 1.3.9 1 2 2.2 4.1 2.2 2.7 0 4.4-1.3 5.1-3.8-1 .9-2.1 1.2-3.4.9-.7-.2-1.2-.7-1.8-1.3-.9-1-2-2.2-4.1-2.2ZM6.9 12.1c-2.7 0-4.4 1.3-5.1 3.8 1-.9 2.1-1.2 3.4-.9.7.2 1.2.7 1.8 1.3.9 1 2 2.2 4.1 2.2 2.7 0 4.4-1.3 5.1-3.8-1 .9-2.1 1.2-3.4.9-.7-.2-1.2-.7-1.8-1.3-.9-1-2-2.2-4.1-2.2Z" fill="#38bdf8" />
    </svg>
  )
}

export function PythonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M11.8 2.5c-4.1 0-3.8 1.8-3.8 1.8v2h3.9v.7H6.4S3 6.6 3 10.8s3 4.1 3 4.1h1.8v-2.2s-.1-2.7 2.7-2.7h4.5s2.5 0 2.5-2.4V4.7s.4-2.2-4.3-2.2h-1.4Zm-2.2 1.3a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z" fill="#3776ab" />
      <path d="M12.2 21.5c4.1 0 3.8-1.8 3.8-1.8v-2h-3.9V17h5.5s3.4.4 3.4-3.8-3-4.1-3-4.1h-1.8v2.2s.1 2.7-2.7 2.7H9s-2.5 0-2.5 2.4v2.9s-.4 2.2 4.3 2.2h1.4Zm2.2-1.3a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z" fill="#ffd343" />
    </svg>
  )
}

export function LangChainIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M8.4 8.4 5.7 5.7m9.9 9.9 2.7 2.7M15.6 8.4l2.7-2.7m-9.9 9.9-2.7 2.7" stroke="#18a889" strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="5.6" cy="5.6" r="3" fill="#18a889" />
      <circle cx="18.4" cy="5.6" r="3" fill="#18a889" />
      <circle cx="5.6" cy="18.4" r="3" fill="#18a889" />
      <circle cx="18.4" cy="18.4" r="3" fill="#18a889" />
      <circle cx="12" cy="12" r="3.2" fill="#b5f4df" />
    </svg>
  )
}

export function VercelIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 3 23 21H1L12 3Z" fill="currentColor" />
    </svg>
  )
}

export function JavaScriptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect width="24" height="24" rx="3" fill="#f7df1e" />
      <text x="12" y="17" textAnchor="middle" fill="#161616" fontSize="10" fontWeight="800" fontFamily="Arial, sans-serif">JS</text>
    </svg>
  )
}

export function NeonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 18V6l16 12V6" stroke="#00e599" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4" cy="6" r="2" fill="#00e599" />
      <circle cx="20" cy="18" r="2" fill="#00e599" />
    </svg>
  )
}

export function AuthJsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M12 2.5 20 6v5.3c0 5-3.4 8.6-8 10.2-4.6-1.6-8-5.2-8-10.2V6l8-3.5Z" fill="#f8fafc" />
      <path d="M12 6.2a3 3 0 0 0-1.7 5.5v3.7h3.4v-3.7A3 3 0 0 0 12 6.2Z" fill="#111827" />
    </svg>
  )
}

export function FastApiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="m13.8 2.8-9.3 11h6.1l-.6 7.4 9.5-11.5h-6.2l.5-6.9Z" fill="#05998b" />
    </svg>
  )
}

export function SlackIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M8.7 2a2 2 0 0 1 2 2v6H6.7V4a2 2 0 0 1 2-2Z" fill="#36c5f0" />
      <path d="M22 8.7a2 2 0 0 1-2 2h-6V6.7h6a2 2 0 0 1 2 2Z" fill="#2eb67d" />
      <path d="M15.3 22a2 2 0 0 1-2-2v-6h4v6a2 2 0 0 1-2 2Z" fill="#ecb22e" />
      <path d="M2 15.3a2 2 0 0 1 2-2h6v4H4a2 2 0 0 1-2-2Z" fill="#e01e5a" />
      <path d="M8.7 13.3h2v4h-2a2 2 0 1 1 0-4Z" fill="#e01e5a" />
      <path d="M13.3 8.7h4v2a2 2 0 1 1-4 0v-2Z" fill="#36c5f0" />
    </svg>
  )
}

export const TECH_ICONS = {
  'Next.js': NextJsIcon,
  React: ReactIcon,
  'React Native': ReactIcon,
  TypeScript: TypeScriptIcon,
  'Tailwind CSS': TailwindIcon,
  Expo: ExpoIcon,
  Python: PythonIcon,
  LangChain: LangChainIcon,
  LangGraph: LangChainIcon,
  RAG: RagIcon,
  PostgreSQL: PostgresIcon,
  Neon: NeonIcon,
  Qdrant: QdrantIcon,
  Docker: DockerIcon,
  'AWS EC2': AwsIcon,
  Vercel: VercelIcon,
  JavaScript: JavaScriptIcon,
  'Vercel AI SDK': VercelIcon,
  'Auth.js': AuthJsIcon,
  FastAPI: FastApiIcon,
  Slack: SlackIcon,
} as const

export type TechIconName = keyof typeof TECH_ICONS

export function TechIcon({ name, ...props }: IconProps & { name: TechIconName }) {
  const Icon = TECH_ICONS[name]
  return <Icon {...props} />
}
