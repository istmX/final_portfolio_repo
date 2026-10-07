function Contanier({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-3xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <span className="page-divider absolute inset-y-0 left-4 hidden sm:left-6 sm:block lg:left-0" />
        <span className="page-divider absolute inset-y-0 right-4 hidden sm:right-6 sm:block lg:right-0" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default Contanier
