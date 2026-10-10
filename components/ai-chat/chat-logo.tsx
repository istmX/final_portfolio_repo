export default function ChatLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      aria-label="istmX"
      className={className}
    >
      <g fill="currentColor">
        <path d="M118 132L238 132L304 211L247 269L191 205L151 247V334H118V132Z" />
        <path d="M129 401L157 350L362 145L408 100L382 164L334 219L276 277L407 407H302L225 329L129 401Z" />
        <path d="M273 151H320L296 198L273 151Z" />
        <path d="M224 365H271L247 319L224 365Z" />
      </g>
    </svg>
  )
}
