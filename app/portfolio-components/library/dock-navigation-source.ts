export const dockNavigationSourceCode = String.raw`'use client'

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import type { MotionValue } from 'motion/react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type DockNavigationItem = {
  label: string
  href: string
  icon: ReactNode
  active?: boolean
  external?: boolean
}

export type DockNavigationProps = {
  items: DockNavigationItem[]
  label?: string
  className?: string
  itemClassName?: string
  iconClassName?: string
  glow?: false | DockNavigationGlow
}

export type DockNavigationGlow = {
  color?: string
  opacity?: number
  blur?: number
}

function DockItem({
  item,
  index,
  pointerX,
  iconClassName,
  itemClassName,
  glowEnabled,
}: {
  item: DockNavigationItem
  index: number
  pointerX: MotionValue<number>
  iconClassName?: string
  itemClassName?: string
  glowEnabled: boolean
}) {
  const reduceMotion = useReducedMotion()
  const center = 30 + index * 52
  const scale = useTransform(
    pointerX,
    [center - 84, center - 42, center, center + 42, center + 84],
    [1, 1.08, 1.36, 1.08, 1],
  )
  const smoothScale = useSpring(scale, {
    stiffness: 360,
    damping: 15,
    mass: 0.38,
  })
  const lift = useTransform(
    pointerX,
    [center - 84, center - 42, center, center + 42, center + 84],
    [0, -4, -13, -4, 0],
  )
  const smoothLift = useSpring(lift, {
    stiffness: 340,
    damping: 15,
    mass: 0.38,
  })
  const tooltipY = useTransform(
    () => smoothLift.get() - (smoothScale.get() - 1) * 24,
  )
  const isExternal = item.external ?? /^https?:\/\//.test(item.href)
  const content = (
    <>
      {glowEnabled ? (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute z-0 size-14 rounded-full bg-[radial-gradient(ellipse_at_center,var(--dock-glow-color)_0%,transparent_72%)] opacity-0 blur-[var(--dock-glow-blur)] transition-opacity duration-300 group-hover/dock:opacity-[var(--dock-glow-opacity)] group-focus-visible/dock:opacity-[var(--dock-glow-opacity)]',
            item.active && 'opacity-[var(--dock-glow-opacity)]',
          )}
        />
      ) : null}
      <motion.span
        style={{
          scale: reduceMotion ? 1 : smoothScale,
          y: reduceMotion ? 0 : smoothLift,
        }}
        whileTap={reduceMotion ? undefined : { rotate: -3 }}
        className={cn(
          'border-border/70 bg-background text-muted group-hover/dock:border-foreground/55 group-hover/dock:bg-surface/70 group-hover/dock:text-foreground group-focus-visible/dock:border-foreground/55 group-focus-visible/dock:text-foreground relative isolate flex size-11 origin-bottom items-center justify-center overflow-hidden rounded-lg border transition-[border-color,background-color,color]',
          item.active && 'border-foreground/60 bg-surface/70 text-foreground',
          iconClassName,
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-[linear-gradient(145deg,rgba(255,255,255,0.13)_0%,transparent_48%,rgba(0,0,0,0.06)_100%)] opacity-0 transition-opacity duration-200 group-hover/dock:opacity-100 group-focus-visible/dock:opacity-100"
        />
        <span className="relative z-10">{item.icon}</span>
        {item.active ? (
          <motion.span
            layoutId="dock-navigation-active-dot"
            className="bg-foreground absolute -bottom-1.5 size-1 rounded-full"
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 460, damping: 34 }
            }
          />
        ) : null}
      </motion.span>
      <motion.span
        style={{ y: reduceMotion ? 0 : tooltipY }}
        className="border-border/70 bg-background text-foreground pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 translate-y-1 rounded-md border px-2 py-1 font-mono text-[9px] whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover/dock:translate-y-0 group-hover/dock:opacity-100 group-focus-visible/dock:translate-y-0 group-focus-visible/dock:opacity-100"
      >
        {item.label}
      </motion.span>
    </>
  )

  const linkClassName = cn(
    'group/dock relative flex size-11 cursor-pointer items-center justify-center rounded-lg outline-none',
    itemClassName,
  )

  return (
    <li className="relative flex size-11 items-center justify-center">
      <a
        href={item.href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
        aria-label={item.label}
        aria-current={item.active ? 'page' : undefined}
        className={linkClassName}
      >
        {content}
      </a>
    </li>
  )
}

export default function DockNavigation({
  items,
  label = 'Primary navigation',
  className,
  itemClassName,
  iconClassName,
  glow = {},
}: DockNavigationProps) {
  const pointerX = useMotionValue(-1000)
  const reduceMotion = useReducedMotion()
  const glowOptions = typeof glow === 'object' ? glow : {}
  const glowStyle = {
    '--dock-glow-color': glowOptions.color ?? 'var(--foreground)',
    '--dock-glow-opacity': Math.min(1, Math.max(0, glowOptions.opacity ?? 0.2)),
    '--dock-glow-blur': \`\${Math.max(0, glowOptions.blur ?? 10)}px\`,
  } as CSSProperties

  function updatePointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch' || reduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(event.clientX - bounds.left)
  }

  return (
    <nav aria-label={label}>
      <div
        onPointerMove={updatePointer}
        onPointerLeave={() => pointerX.set(-1000)}
        style={glowStyle}
        className={cn(
          'border-border/70 bg-background/95 inline-flex rounded-xl border p-2',
          className,
        )}
      >
        <ul className="flex items-end gap-2">
          {items.map((item, index) => (
            <DockItem
              key={\`\${item.href}-\${item.label}\`}
              item={item}
              index={index}
              pointerX={pointerX}
              iconClassName={iconClassName}
              itemClassName={itemClassName}
              glowEnabled={glow !== false}
            />
          ))}
        </ul>
      </div>
    </nav>
  )
}
`
  .replaceAll('\\`', '`')
  .replaceAll('\\${', '${')
