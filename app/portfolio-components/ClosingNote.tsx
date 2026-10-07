export default function ClosingNote() {
  return (
    <section
      aria-label="A small closing note"
      className="bg-surface/10 rounded-t-[20px] px-8 pt-14 pb-11 sm:pt-16 sm:pb-12"
    >
      <blockquote className="mx-auto max-w-lg text-center">
        <p className="font-display text-foreground/90 mx-auto max-w-[23ch] text-lg leading-relaxed font-medium tracking-tight sm:text-xl">
          “Even the quietest steps
          <br className="hidden sm:block" /> still carry you somewhere.”
        </p>
        <footer className="text-muted mt-3 text-[11px] tracking-wide">
          ~ a wise cat
        </footer>
      </blockquote>

      <div className="mt-8 flex justify-center">
        <div className="w-fit">
          <p className="text-muted/75 font-mono text-[9px] tracking-[0.08em] sm:text-[10px]">
            meow meow meow meow meow mewww ~
          </p>
          <div className="relative h-10">
            <svg
              aria-hidden="true"
              viewBox="0 0 64 48"
              fill="none"
              className="text-muted/55 absolute top-[-2px] left-[68%] h-10 w-12 overflow-visible"
            >
              <path
                d="M59 43C53 36 48 33 50 28c2-5-5-8-11-10-8-2-14-5-22-12"
                stroke="currentColor"
                strokeWidth="1.15"
                strokeLinecap="round"
              />
              <path
                d="M17 6c1 4 0 7-2 10M17 6c4 2 7 2 11 0"
                stroke="currentColor"
                strokeWidth="1.15"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-muted/55 text-right text-[8px] tracking-wide">
            psst… there&apos;s a little visitor nearby
          </p>
        </div>
      </div>
    </section>
  )
}
