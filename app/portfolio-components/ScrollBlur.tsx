function ScrollBlur() {
  return (
    <div
      aria-hidden="true"
      className="from-background/85 via-background/55 pointer-events-none fixed inset-x-0 bottom-0 z-[5] h-32 bg-gradient-to-t to-transparent backdrop-blur-2xl sm:h-40"
      style={{
        maskImage:
          'linear-gradient(to top, black 0%, black 55%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to top, black 0%, black 55%, transparent 100%)',
      }}
    />
  )
}

export default ScrollBlur
