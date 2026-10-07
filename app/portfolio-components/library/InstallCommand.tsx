'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IconCheck, IconCopy, IconSelector } from '@tabler/icons-react'
import ShimmerText from '@/app/portfolio-components/ShimmerText'
import DoubleBorderCard from '@/app/portfolio-components/DoubleBorderCard'

const PACKAGE_MANAGERS = {
  npm: 'npx @istmx/ui add',
  pnpm: 'pnpm dlx @istmx/ui add',
  yarn: 'yarn dlx @istmx/ui add',
  bun: 'bunx @istmx/ui add',
} as const

const DEPENDENCY_COMMANDS = {
  npm: 'npm install',
  pnpm: 'pnpm add',
  yarn: 'yarn add',
  bun: 'bun add',
} as const

type PackageManager = keyof typeof PACKAGE_MANAGERS
type InstallCommandProps = {
  component: string
  mode?: 'component' | 'dependencies'
}

export default function InstallCommand({
  component,
  mode = 'component',
}: InstallCommandProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>('npm')
  const [managerMenuOpen, setManagerMenuOpen] = useState(false)
  const [copiedCommand, setCopiedCommand] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)
  const managerControlRef = useRef<HTMLDivElement>(null)
  const managerTriggerRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()
  const commandPrefix =
    mode === 'dependencies'
      ? DEPENDENCY_COMMANDS[packageManager]
      : PACKAGE_MANAGERS[packageManager]
  const command = `${commandPrefix} ${component}`
  const copied = copiedCommand === command

  useEffect(() => {
    if (!managerMenuOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !managerControlRef.current?.contains(event.target)
      ) {
        setManagerMenuOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setManagerMenuOpen(false)
        managerTriggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [managerMenuOpen])

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command)
      setCopiedCommand(command)
      setCopyFailed(false)
      window.setTimeout(() => setCopiedCommand(''), 1800)
    } catch {
      setCopyFailed(true)
      setCopiedCommand('')
    }
  }

  return (
    <div>
      <DoubleBorderCard innerClassName="bg-surface/20 border-border/40">
        <div
          ref={managerControlRef}
          className="border-border/70 relative flex items-center justify-between gap-3 border-b px-3 py-2.5 sm:px-4"
        >
          <span className="font-secondary text-muted text-[11px]">
            Package manager
          </span>
          <div className="relative">
            <button
              ref={managerTriggerRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={managerMenuOpen}
              aria-label={`Package manager: ${packageManager}`}
              onClick={() => setManagerMenuOpen((open) => !open)}
              className="border-border/70 bg-background text-foreground font-secondary hover:border-border focus-visible:outline-foreground inline-flex min-w-28 cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={packageManager}
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: 3,
                          backgroundColor: 'var(--surface)',
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: 'transparent',
                  }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                  className="inline-block rounded px-1"
                >
                  {packageManager}
                </motion.span>
              </AnimatePresence>
              <IconSelector size={15} stroke={1.7} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {managerMenuOpen && (
                <motion.div
                  role="menu"
                  aria-label="Choose a package manager"
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -3, scale: 0.98 }}
                  transition={{ duration: reduceMotion ? 0 : 0.14 }}
                  className="border-border bg-background absolute top-[calc(100%+6px)] right-0 z-20 min-w-28 rounded-md border p-1 shadow-md"
                >
                  {(Object.keys(PACKAGE_MANAGERS) as PackageManager[]).map(
                    (manager) => (
                      <button
                        key={manager}
                        type="button"
                        role="menuitemradio"
                        aria-checked={packageManager === manager}
                        onClick={() => {
                          setPackageManager(manager)
                          setManagerMenuOpen(false)
                          setCopyFailed(false)
                        }}
                        className={`font-secondary focus-visible:outline-foreground flex w-full cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${
                          packageManager === manager
                            ? 'text-foreground bg-surface/70'
                            : 'text-muted hover:bg-surface/50 hover:text-foreground'
                        }`}
                      >
                        {manager}
                        {packageManager === manager && (
                          <IconCheck
                            size={13}
                            stroke={1.8}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    ),
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex min-h-14 items-center justify-between gap-3 px-3 py-2 sm:px-4">
          <code className="text-foreground font-code min-w-0 flex-1 overflow-x-auto text-xs whitespace-nowrap sm:text-sm">
            <span className="text-muted select-none">$ </span>
            <span>{commandPrefix} </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={component}
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        x: -4,
                        filter: 'blur(3px)',
                        backgroundColor: 'var(--surface)',
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  backgroundColor: 'transparent',
                }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: 3, filter: 'blur(2px)' }
                }
                transition={{
                  duration: reduceMotion ? 0 : 0.24,
                  ease: 'easeOut',
                }}
                className="inline-block rounded px-0.5"
              >
                <ShimmerText>{component}</ShimmerText>
              </motion.span>
            </AnimatePresence>
          </code>
          <button
            type="button"
            onClick={copyCommand}
            aria-label={copied ? 'Command copied' : 'Copy command'}
            className="font-secondary text-muted hover:text-foreground focus-visible:outline-foreground flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? 'copied' : 'copy'}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ duration: 0.14 }}
                aria-hidden="true"
              >
                {copied ? (
                  <IconCheck size={17} stroke={1.8} />
                ) : (
                  <IconCopy size={16} stroke={1.6} />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </DoubleBorderCard>
      <p
        className="font-secondary text-muted mt-2 min-h-4 text-[10px]"
        aria-live="polite"
      >
        {copyFailed
          ? 'Could not copy. Select and copy the command instead.'
          : copied
            ? 'Command copied.'
            : 'Copies the install command for your selected package manager.'}
      </p>
    </div>
  )
}
