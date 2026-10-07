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
    <div className="bg-surface/30 flex min-h-44 items-center justify-center rounded-xl px-4 py-8">
        <DockNavigation
          items={items}
          label="Portfolio links"
          glow={{ color: 'var(--foreground)', opacity: 0.2, blur: 12 }}
        />
    </div>
  )
}
