import { LinkPreview } from './ui/link-preview'
import { GlowingEffect } from './ui/glowing-effect'
import SocialProfileCard from './SocialProfileCard'

const LINKS = [
  {
    name: 'GitHub',
    href: 'https://github.com/istmX',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.6 1.2 3.24.92.1-.72.39-1.2.7-1.48-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.22 1.15-3-.12-.29-.5-1.43.11-2.98 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.55.23 2.69.12 2.98.71.78 1.14 1.78 1.14 3 0 4.29-2.6 5.23-5.09 5.51.4.35.75 1.02.75 2.06V22c0 .29.2.64.77.53A11.1 11.1 0 0 0 12 .9Z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/Istm_x',
    handle: '@Istm_x',
    detail: 'I share notes about building, AI engineering, and ideas in progress.',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-[17px]">
        <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.26l-4.9-7.58L5.4 22H2.27l7.25-8.29L1.8 2h6.42l4.43 6.96L18.9 2Zm-1.1 18h1.73L7.28 3.9H5.42L17.8 20Z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/aryan-xf/',
    handle: 'linkedin.com/in/aryan-xf',
    detail: 'Developer focused on AI engineering, full-stack products, and mobile apps.',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
        <path d="M5.2 3.4a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.4 9h3.7v11.6H3.4V9Zm5.9 0h3.5v1.6h.05a3.85 3.85 0 0 1 3.46-1.9c3.7 0 4.39 2.43 4.39 5.6v6.3H17v-5.59c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.69H9.3V9Z" />
      </svg>
    ),
  },
] as const

function EmailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-[18px]" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export default function SocialLinks() {
  return (
    <section aria-label="Social links" className="px-8 pb-10 pt-1 sm:px-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
        <h2 className="shrink-0 text-xs font-medium uppercase tracking-[0.16em] text-muted">
          Find me
        </h2>
        <div className="flex items-center gap-2">
          {LINKS.map((link) => (
            <span
              key={link.name}
              className="relative isolate block rounded-[15px] border border-border/40 p-[3px] transition-colors hover:border-border/80"
            >
              <GlowingEffect spread={34} proximity={46} inactiveZone={0.45} disabled={false} />
              {link.name === 'GitHub' ? (
                <LinkPreview
                  url={link.href}
                  label={`Open ${link.name} profile`}
                  width={320}
                  height={200}
                  className="relative z-10 flex size-10 items-center justify-center rounded-[11px] border border-border/70 bg-surface/40 text-muted transition-colors hover:border-foreground/60 hover:bg-surface hover:text-foreground focus-visible:border-foreground/60 focus-visible:text-foreground focus-visible:outline-none"
                >
                  {link.icon}
                </LinkPreview>
              ) : (
                <SocialProfileCard
                  name={link.name}
                  href={link.href}
                  handle={link.handle}
                  detail={link.detail}
                  className="relative z-10 flex size-10 items-center justify-center rounded-[11px] border border-border/70 bg-surface/40 text-muted transition-colors hover:border-foreground/60 hover:bg-surface hover:text-foreground focus-visible:border-foreground/60 focus-visible:text-foreground focus-visible:outline-none"
                >
                  {link.icon}
                </SocialProfileCard>
              )}
            </span>
          ))}

          <span className="relative isolate block rounded-[15px] border border-border/40 p-[3px] transition-colors hover:border-border/80">
            <GlowingEffect spread={34} proximity={46} inactiveZone={0.45} disabled={false} />
            <SocialProfileCard
              name="Email"
              href="mailto:xparyan68@gmail.com"
              handle="xparyan68@gmail.com"
              detail="Have a project or a question? Send me a note."
              isEmail
              className="relative z-10 flex size-10 items-center justify-center rounded-[11px] border border-border/70 bg-surface/40 text-muted transition-colors hover:border-foreground/60 hover:bg-surface hover:text-foreground focus-visible:border-foreground/60 focus-visible:text-foreground focus-visible:outline-none"
            >
              <EmailIcon />
            </SocialProfileCard>
          </span>
        </div>
      </div>
    </section>
  )
}
