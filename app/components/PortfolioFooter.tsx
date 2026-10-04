import FooterSignature from './FooterSignature'

const FOOTER_LINKS = [
  { label: 'GitHub', href: 'https://github.com/istmX' },
  { label: 'X', href: 'https://x.com/Istm_x' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aryan-xf/' },
  { label: 'Email', href: 'mailto:xparyan68@gmail.com' },
]

export default function PortfolioFooter() {
  return (
    <footer className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <span className="page-divider absolute inset-y-0 left-4 hidden sm:block sm:left-6 lg:left-0" />
        <span className="page-divider absolute inset-y-0 right-4 hidden sm:block sm:right-6 lg:right-0" />
      </div>

      <div className="relative z-10 border-t border-dotted border-border/60">
        <div className="flex min-h-[300px] flex-col items-center justify-center px-7 py-10 text-center sm:py-12">
          <p className="max-w-[34ch] font-display text-lg font-medium leading-relaxed tracking-tight text-foreground sm:text-xl">
            Built this when I should&apos;ve been building my main project.
          </p>
          <div className="mt-2">
            <FooterSignature />
          </div>
          <p className="mt-1 text-[11px] text-muted sm:text-xs">Thanks for visiting.</p>
          <p className="mt-3 font-mono text-[8px] tracking-[0.08em] text-muted/55 sm:text-[9px]">
            meow meow meow mewww ~
          </p>
        </div>

        <div className="flex min-h-14 flex-col items-center justify-between gap-3 border-t border-border/25 py-3 text-[9px] text-muted/70 sm:flex-row sm:px-1">
          <nav aria-label="Footer social links" className="flex items-center gap-2.5">
            {FOOTER_LINKS.map((link, index) => (
              <span key={link.label} className="inline-flex items-center gap-2.5">
                {index > 0 && <span aria-hidden="true" className="text-muted/35">·</span>}
                <a href={link.href} className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground">{link.label}</a>
              </span>
            ))}
          </nav>
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
            <span className="tracking-[0.08em]">© 2026 ISTMX</span>
            <a href="#top" aria-label="Back to top" className="grid size-7 place-items-center rounded-full border border-border/45 text-muted transition-colors hover:border-border hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 13V3M4.5 6.5 8 3l3.5 3.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
