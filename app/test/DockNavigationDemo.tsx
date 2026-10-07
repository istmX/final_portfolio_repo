'use client'

import {
  IconCode,
  IconComponents,
  IconHome,
  IconMail,
  IconUser,
} from '@tabler/icons-react'
import DockNavigation from '@/components/ui/dock-navigation'

const items = [
  { label: 'Home', href: '/', icon: <IconHome size={19} stroke={1.6} /> },
  {
    label: 'About',
    href: '/#about',
    icon: <IconUser size={19} stroke={1.6} />,
  },
  {
    label: 'Projects',
    href: '/#projects',
    icon: <IconCode size={19} stroke={1.6} />,
    active: true,
  },
  {
    label: 'Components',
    href: '/library',
    icon: <IconComponents size={19} stroke={1.6} />,
  },
  {
    label: 'Contact',
    href: '/#contact',
    icon: <IconMail size={19} stroke={1.6} />,
  },
]

export default function DockNavigationDemo() {
  return (
    <section className="border-border mt-24 border-t pt-12">
      <p className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">
        Navigation experiment
      </p>
      <h2 className="font-display mt-2 text-2xl tracking-tight sm:text-3xl">
        Dock Navigation
      </h2>
      <p className="text-muted mt-2 max-w-xl text-sm leading-6">
        Hover across the dock to lift and elastically magnify nearby icons with
        a soft radial highlight. Each item is a regular link with a label, an
        optional active state, and a custom icon.
      </p>
      <div className="mt-10 flex min-h-36 items-center justify-center">
        <DockNavigation
          items={items}
          label="Portfolio links"
          glow={{ color: 'var(--foreground)', opacity: 0.2, blur: 12 }}
        />
      </div>
    </section>
  )
}
