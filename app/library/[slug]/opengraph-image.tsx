import { ImageResponse } from 'next/og'
import { getLibraryItem } from '@/app/portfolio-components/library/library-items'

export const alt = 'ISTMX source-first React component'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getLibraryItem(slug)
  const name = item?.name ?? 'ISTMX Components'
  const category = item?.category ?? 'Source Library'
  const description =
    item?.seoDescription ?? 'Editable React components created by Aryan.'

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        backgroundColor: '#09090b',
        color: '#f4f4f5',
        fontFamily: 'Arial, sans-serif',
        border: '1px solid #27272a',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#a1a1aa',
          fontSize: 20,
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}
      >
        <span>ISTMX / {category}</span>
        <span>ARYAN · istmX</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 76,
            lineHeight: 1.05,
            letterSpacing: -3,
            fontWeight: 600,
          }}
        >
          {name}
        </h1>
        <p
          style={{
            maxWidth: 890,
            margin: 0,
            color: '#a1a1aa',
            fontSize: 28,
            lineHeight: 1.4,
          }}
        >
          {description}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #3f3f46',
          paddingTop: 22,
          color: '#a1a1aa',
          fontSize: 20,
        }}
      >
        <span>Editable React source · Previews · API reference</span>
        <span>aryanonai.vercel.app</span>
      </div>
    </div>,
    size,
  )
}
