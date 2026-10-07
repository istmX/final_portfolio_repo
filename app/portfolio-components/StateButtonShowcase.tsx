'use client'

import {
  IconBookmark,
  IconCheck,
  IconShare,
  IconTrash,
} from '@tabler/icons-react'
import Button from '@/components/ui/button'

export default function StateButtonShowcase() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button
        intent="save"
        icon={<IconBookmark size={15} stroke={1.8} />}
        feedback={{ label: 'Saved', icon: <IconCheck size={15} stroke={2} /> }}
      >
        Save
      </Button>
      <Button
        intent="share"
        icon={<IconShare size={15} stroke={1.8} />}
        feedback={{ label: 'Link copied', icon: <IconCheck size={15} stroke={2} /> }}
      >
        Share
      </Button>
      <Button
        intent="delete"
        icon={<IconTrash size={15} stroke={1.8} />}
        feedback={{ label: 'Deleted', icon: <IconCheck size={15} stroke={2} /> }}
      >
        Delete
      </Button>
    </div>
  )
}
