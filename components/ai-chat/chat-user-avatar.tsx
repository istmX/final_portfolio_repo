import { IconUser } from '@tabler/icons-react'

export default function ChatUserAvatar({ className = '' }: { className?: string }) {
  return (
    <span className={`bg-surface text-muted relative inline-flex size-full shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}>
      <IconUser size={15} stroke={1.7} aria-hidden="true" />
    </span>
  )
}
