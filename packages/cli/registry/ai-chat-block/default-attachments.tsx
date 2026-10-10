import {
  IconFile,
  IconHeadphones,
  IconPhoto,
  IconVideo,
} from '@tabler/icons-react'
import type { AttachmentOption } from './types'

export const DEFAULT_ATTACHMENT_OPTIONS: readonly AttachmentOption[] = [
  {
    id: 'images',
    label: 'Images',
    description: 'Add photos and images',
    icon: <IconPhoto size={17} stroke={1.7} aria-hidden="true" />,
    accept: 'image/*',
    multiple: true,
  },
  {
    id: 'documents',
    label: 'Files and documents',
    description: 'PDF, text, office files, and more',
    icon: <IconFile size={17} stroke={1.7} aria-hidden="true" />,
    accept: '.pdf,.txt,.md,.csv,.json,.doc,.docx,.xls,.xlsx,.ppt,.pptx,application/*,text/*',
    multiple: true,
  },
  {
    id: 'audio',
    label: 'Audio',
    description: 'Add an audio recording',
    icon: <IconHeadphones size={17} stroke={1.7} aria-hidden="true" />,
    accept: 'audio/*',
    multiple: true,
  },
  {
    id: 'video',
    label: 'Video',
    description: 'Add a video clip',
    icon: <IconVideo size={17} stroke={1.7} aria-hidden="true" />,
    accept: 'video/*',
    multiple: true,
  },
]
