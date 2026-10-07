export const imageAccordionSourceCode = String.raw`'use client'

import { useId, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'motion/react'
import { cn } from '@/lib/utils'

export type ImageAccordionItem = {
  id?: string
  src: string
  alt: string
  title: string
  description?: string
  className?: string
  imageClassName?: string
}

export type ImageAccordionGlow = {
  color?: string
  position?: string
  size?: string
  opacity?: number
  blur?: number
}

export type ImageAccordionProps = {
  images: ImageAccordionItem[]
  className?: string
  stackClassName?: string
  cardClassName?: string
  imageClassName?: string
  previewClassName?: string
  visibleCount?: number
  glow?: false | ImageAccordionGlow
  transition?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}

export function ImageAccordion({
  images,
  className,
  stackClassName,
  cardClassName,
  imageClassName,
  previewClassName,
  visibleCount = 5,
  glow = {},
  transition,
}: ImageAccordionProps) {
  const [stackImages, setStackImages] = useState(images)
  const [activeImage, setActiveImage] = useState<ImageAccordionItem | null>(
    null,
  )
  const reduceMotion = useReducedMotion()
  const layoutId = useId()
  const visibleLimit = Number.isFinite(visibleCount)
    ? Math.max(1, Math.floor(visibleCount))
    : 5
  const visibleImages = stackImages.slice(0, visibleLimit)
  const glowOptions = typeof glow === 'object' ? glow : {}
  const spring = {
    type: 'spring' as const,
    stiffness: transition?.stiffness ?? 190,
    damping: transition?.damping ?? 24,
    mass: transition?.mass ?? 0.8,
  }
  const glowStyle = {
    '--image-accordion-glow-color': glowOptions.color ?? 'var(--foreground)',
    '--image-accordion-glow-position': glowOptions.position ?? 'center',
    '--image-accordion-glow-size': glowOptions.size ?? '72%',
    '--image-accordion-glow-opacity': Math.min(
      1,
      Math.max(0, glowOptions.opacity ?? 0.24),
    ),
    '--image-accordion-glow-blur': \`\${Math.max(0, glowOptions.blur ?? 18)}px\`,
  } as CSSProperties
  const getImageKey = (image: ImageAccordionItem) => image.id ?? image.src
  const activePosition = activeImage
    ? stackImages.findIndex(
        (image) => getImageKey(image) === getImageKey(activeImage),
      ) + 1
    : 0

  function selectImage(image: ImageAccordionItem) {
    const imageKey = getImageKey(image)

    if (activeImage && getImageKey(activeImage) === imageKey) {
      setActiveImage(null)
      return
    }

    setActiveImage(image)
    setStackImages((current) => [
      ...current.filter((item) => getImageKey(item) !== imageKey),
      image,
    ])
  }

  return (
    <LayoutGroup id={layoutId}>
      <section
        aria-label="Image accordion"
        className={cn(
          'grid gap-5 md:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.5fr)] md:items-center md:gap-6',
          className,
        )}
      >
        <div className={stackClassName}>
          <div
            role="group"
            aria-label="Choose an image"
            className="relative mx-auto h-[19rem] w-full max-w-[22rem] sm:h-[22rem]"
          >
            {visibleImages.map((image, index) => {
              const imageKey = getImageKey(image)
              const isActive =
                activeImage !== null &&
                getImageKey(activeImage) === imageKey
              const originalIndex = images.findIndex(
                (item) => getImageKey(item) === imageKey,
              )
              const offset = visibleImages.length - index - 1

              return (
                <motion.button
                  key={imageKey}
                  type="button"
                  aria-label={
                    isActive
                      ? \`Hide preview for \${image.title}\`
                      : \`Show image \${index + 1}: \${image.title}\`
                  }
                  aria-pressed={isActive}
                  onClick={() => selectImage(image)}
                  initial={false}
                  animate={{
                    x: index * 13,
                    y: index * 14,
                    rotate: (index - offset / 2) * 1.4,
                    scale: 1 - offset * 0.018,
                  }}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { x: index * 13 - 5, y: index * 14 - 7, scale: 1.035 }
                  }
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 25,
                    mass: 0.8,
                  }}
                  style={
                    {
                      ...glowStyle,
                      left: \`\${index * 7}%\`,
                      top: \`\${index * 7}%\`,
                      zIndex: visibleImages.length - index,
                    } as CSSProperties
                  }
                  className={cn(
                    'group isolate absolute aspect-[4/3] w-[70%] cursor-pointer overflow-visible rounded-xl text-left focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none',
                    !reduceMotion && 'transition-transform duration-300',
                    cardClassName,
                    image.className,
                  )}
                >
                  {glow !== false ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'pointer-events-none absolute -inset-3 -z-10 rounded-[inherit] bg-[radial-gradient(ellipse_at_var(--image-accordion-glow-position),var(--image-accordion-glow-color)_0%,transparent_var(--image-accordion-glow-size))] blur-[var(--image-accordion-glow-blur)] transition-opacity duration-300',
                        isActive
                          ? 'opacity-[var(--image-accordion-glow-opacity)]'
                          : 'opacity-0 group-hover:opacity-[var(--image-accordion-glow-opacity)] group-focus-visible:opacity-[var(--image-accordion-glow-opacity)]',
                      )}
                    />
                  ) : null}

                  <span
                    className={cn(
                      'border-border/70 bg-surface group-hover:border-foreground/55 relative block size-full overflow-hidden rounded-xl border shadow-[0_12px_32px_-18px_rgba(0,0,0,0.7)] transition-colors duration-300',
                      isActive && 'border-foreground/60',
                    )}
                  >
                    <motion.img
                      layoutId={
                        isActive
                          ? undefined
                          : \`\${layoutId}-image-\${originalIndex}\`
                      }
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      draggable={false}
                      transition={spring}
                      className={cn(
                        'size-full object-cover',
                        !reduceMotion &&
                          'transition-transform duration-500 ease-out group-hover:scale-105',
                        imageClassName,
                        image.imageClassName,
                      )}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-3 pt-8 pb-2 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      {String(index + 1).padStart(2, '0')} / {image.title}
                    </span>
                  </span>
                </motion.button>
              )
            })}
          </div>

          <div className="text-muted mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase">
            <span>Image stack</span>
            <span>
              {String(visibleImages.length).padStart(2, '0')} /{' '}
              {String(stackImages.length).padStart(2, '0')} images
            </span>
          </div>
        </div>

        <div
          className={cn(
            'border-border/70 bg-surface/30 relative flex aspect-[4/3] min-h-64 items-center justify-center overflow-hidden rounded-xl border md:min-h-0',
            previewClassName,
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {activeImage ? (
              <motion.figure
                key={getImageKey(activeImage)}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0.8 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
                className="absolute inset-0 m-0"
              >
                <motion.img
                  layoutId={\`\${layoutId}-image-\${images.findIndex((image) => getImageKey(image) === getImageKey(activeImage))}\`}
                  src={activeImage.src}
                  alt={activeImage.alt}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  transition={spring}
                  className={cn(
                    'size-full object-cover',
                    imageClassName,
                    activeImage.imageClassName,
                  )}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pt-16 pb-5 text-white sm:px-7 sm:pb-7">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-white/65 uppercase">
                    Image {String(activePosition).padStart(2, '0')} /{' '}
                    {String(stackImages.length).padStart(2, '0')}
                  </p>
                  <h2 className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                    {activeImage.title}
                  </h2>
                  {activeImage.description ? (
                    <p className="mt-1 max-w-lg text-sm leading-6 text-white/75">
                      {activeImage.description}
                    </p>
                  ) : null}
                </figcaption>
              </motion.figure>
            ) : (
              <motion.div
                key="empty-preview"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="px-6 text-center"
              >
                <p className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">
                  Preview
                </p>
                <p className="text-muted mt-2 text-sm">
                  Select a corner to reveal an image.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </LayoutGroup>
  )
}

export default ImageAccordion
`
  .replaceAll('\\`', '`')
  .replaceAll('\\${', '${')
