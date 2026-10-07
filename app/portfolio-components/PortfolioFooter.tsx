import { TextHoverEffect } from '@/app/portfolio-components/ui/text-hover-effect'
import InteractiveDotField from './InteractiveDotField'

export default function PortfolioFooter() {
  return (
    <footer
      aria-label="Footer"
      className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <span className="page-divider absolute inset-y-0 left-4 hidden sm:left-6 sm:block lg:left-0" />
        <span className="page-divider absolute inset-y-0 right-4 hidden sm:right-6 sm:block lg:right-0" />
      </div>
      <div className="border-border/60 relative z-10 flex h-48 items-center justify-center overflow-hidden border-t border-dotted sm:h-60">
        <InteractiveDotField className="pointer-events-none absolute inset-x-8 top-[36%] bottom-0 z-0" />
        <p className="text-muted/60 pointer-events-none absolute top-5 font-mono text-[8px] tracking-[0.2em] uppercase sm:top-7 sm:text-[9px]">
          Thanks for visiting
        </p>
        <TextHoverEffect text="ARYAN" />
      </div>
    </footer>
  )
}
