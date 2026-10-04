import { TextHoverEffect } from './ui/text-hover-effect'
import InteractiveDotField from './InteractiveDotField'

export default function PortfolioFooter() {
  return (
    <footer aria-label="Footer" className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <span className="page-divider absolute inset-y-0 left-4 hidden sm:block sm:left-6 lg:left-0" />
        <span className="page-divider absolute inset-y-0 right-4 hidden sm:block sm:right-6 lg:right-0" />
      </div>
      <div className="relative z-10 flex h-48 items-center justify-center overflow-hidden border-t border-dotted border-border/60 sm:h-60">
        <InteractiveDotField className="pointer-events-none absolute inset-x-8 bottom-0 top-[36%] z-0" />
        <p className="pointer-events-none absolute top-5 font-mono text-[8px] uppercase tracking-[0.2em] text-muted/60 sm:top-7 sm:text-[9px]">
          Thanks for visiting
        </p>
        <TextHoverEffect text="ARYAN" />
      </div>
    </footer>
  )
}
