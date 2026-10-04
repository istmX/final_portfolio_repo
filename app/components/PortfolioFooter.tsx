import FooterBotanical from './FooterBotanical'

const FOOTER_LINKS = [
  { label: 'GitHub', href: 'https://github.com/istmX' },
  { label: 'X', href: 'https://x.com/Istm_x' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aryan-xf/' },
  { label: 'Email', href: 'mailto:xparyan68@gmail.com' },
]

export default function PortfolioFooter() {
  return (
    <footer className="relative isolate mx-auto min-h-[520px] w-full max-w-5xl overflow-hidden rounded-t-[20px] border-t border-dotted border-border/45 bg-surface/10">
      {/* Botanical garden illustration – spans the full footer width */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px] opacity-95 sm:h-[460px]"
      >
        <FooterBotanical />
      </div>

      {/* Content sits in the central clearing among the flowers */}
      <div className="relative z-10 flex flex-col items-center px-8 pt-[110px] text-center sm:pt-[160px]">
        <p className="font-signature text-[4.2rem] font-normal leading-[0.88] text-foreground sm:text-[5.2rem]">
          Aryan
        </p>
        <p className="mt-3 text-xs text-muted sm:text-sm">
          Thanks for visiting here.
        </p>
        <p className="mt-5 font-mono text-[9px] tracking-[0.14em] text-muted/80">
          flowers for you
        </p>
        <p className="mt-2 font-mono text-[8px] tracking-[0.08em] text-muted/55">
          meow meow meow meow mewww ~
        </p>
      </div>

      <nav
        aria-label="Footer social links"
        className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-[10px] text-muted/80"
      >
        {FOOTER_LINKS.map((link, index) => (
          <span key={link.label} className="inline-flex items-center gap-2.5">
            {index > 0 && (
              <span aria-hidden="true" className="text-muted/45">
                ·
              </span>
            )}
            <a
              href={link.href}
              className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
            >
              {link.label}
            </a>
          </span>
        ))}
      </nav>

      <div className="relative z-10 mt-5 border-t border-border/25 px-8 py-3 text-center text-[9px] tracking-[0.12em] text-muted/65">
        © 2026 ISTMX
      </div>
    </footer>
  )
}
