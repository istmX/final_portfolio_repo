import Image from 'next/image'

export default function PortfolioBanner() {
  return (
    <section aria-label="Portfolio banner" className="px-4 pt-6 sm:px-6 sm:pt-10">
      <div className="relative isolate aspect-[1.9/1] overflow-hidden rounded-2xl bg-surface sm:aspect-[3.15/1]">
        <Image
          src="/portfolio-banner.png"
          alt="A quiet hillside workspace overlooking a sunlit river valley"
          fill
          preload
          sizes="(max-width: 768px) calc(100vw - 2rem), 672px"
          className="object-cover object-[70%_center] sm:object-center"
        />
      </div>
    </section>
  )
}
