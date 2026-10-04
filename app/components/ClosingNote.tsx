export default function ClosingNote() {
  return (
    <section aria-label="A small closing note" className="rounded-t-[20px] bg-surface/10 px-8 pb-11 pt-14 sm:pb-12 sm:pt-16">
      <blockquote className="mx-auto max-w-lg text-center">
        <p className="mx-auto max-w-[23ch] font-display text-lg font-medium leading-relaxed tracking-tight text-foreground/90 sm:text-xl">
          “Even the quietest steps<br className="hidden sm:block" /> still carry you somewhere.”
        </p>
        <footer className="mt-3 text-[11px] tracking-wide text-muted">~ a wise cat</footer>
      </blockquote>

      <div className="mt-8 flex justify-center">
        <div className="w-fit">
          <p className="font-mono text-[9px] tracking-[0.08em] text-muted/75 sm:text-[10px]">meow meow meow meow meow mewww ~</p>
          <div className="relative h-10">
            <svg aria-hidden="true" viewBox="0 0 64 48" fill="none" className="absolute left-[68%] top-[-2px] h-10 w-12 overflow-visible text-muted/55">
              <path d="M59 43C53 36 48 33 50 28c2-5-5-8-11-10-8-2-14-5-22-12" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
              <path d="M17 6c1 4 0 7-2 10M17 6c4 2 7 2 11 0" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-right text-[8px] tracking-wide text-muted/55">psst… there&apos;s a little visitor nearby</p>
        </div>
      </div>
    </section>
  )
}
