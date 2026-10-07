'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import ShimmerText from '@/app/portfolio-components/ShimmerText'

const PACKAGE_MANAGERS = {
  npm: 'npx istmx add',
  pnpm: 'pnpm dlx istmx add',
  yarn: 'yarn dlx istmx add',
  bun: 'bunx istmx add',
} as const

type PackageManager = keyof typeof PACKAGE_MANAGERS

export default function InstallCommand({
  component,
  animated = false,
}: {
  component: string
  animated?: boolean
}) {
  const [packageManager, setPackageManager] = useState<PackageManager>('npm')
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const reduceMotion = useReducedMotion()
  const command = `${PACKAGE_MANAGERS[packageManager]} ${component}`

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setCopyFailed(false)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopyFailed(true)
      setCopied(false)
    }
  }

  return (
    <div>
      <div className="border-border bg-surface/50 rounded-lg border">
        <div
          role="group"
          aria-label="Package manager"
          className="border-border/70 flex gap-1 border-b px-2 pt-2"
        >
          {(Object.keys(PACKAGE_MANAGERS) as PackageManager[]).map(
            (manager) => (
              <button
                key={manager}
                type="button"
                aria-pressed={packageManager === manager}
                onClick={() => setPackageManager(manager)}
                className={`focus-visible:outline-foreground rounded-t-md px-3 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  packageManager === manager
                    ? 'bg-background text-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {manager}
              </button>
            ),
          )}
        </div>
        <div className="flex min-h-14 items-center justify-between gap-3 px-3 py-2 sm:px-4">
          <code className="text-foreground min-w-0 overflow-x-auto font-mono text-[11px] sm:text-xs">
            <span className="text-muted select-none">$ </span>
            {PACKAGE_MANAGERS[packageManager]}{' '}
            {animated ? (
              <span className="inline-grid min-w-24 align-bottom">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={component}
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 6, filter: 'blur(4px)' }
                    }
                    animate={
                      reduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, filter: 'blur(0px)' }
                    }
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -5, filter: 'blur(4px)' }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.25,
                      ease: 'easeOut',
                    }}
                    className="whitespace-nowrap"
                  >
                    <ShimmerText>{component}</ShimmerText>
                  </motion.span>
                </AnimatePresence>
              </span>
            ) : (
              <ShimmerText>{component}</ShimmerText>
            )}
          </code>
          <button
            type="button"
            onClick={copyCommand}
            aria-label={copied ? 'Command copied' : 'Copy command'}
            className="text-muted hover:text-foreground focus-visible:outline-foreground flex size-9 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
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
      </div>
      <p className="text-muted mt-2 min-h-4 text-[10px]" aria-live="polite">
        {copyFailed
          ? 'Could not copy. Select and copy the command instead.'
          : copied
            ? 'Command copied.'
            : 'Copies the install command for your selected package manager.'}
      </p>
    </div>
  )
}
