'use client'

import {
  IconArchive,
  IconDots,
  IconMessageCircle,
  IconMessageCircleFilled,
  IconPin,
  IconPlus,
  IconRestore,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import ChatUserAvatar from './chat-user-avatar'
import ChatLogo from './chat-logo'

export type ChatSidebarItem = {
  id: string
  title: string
  pinned?: boolean
  archived?: boolean
}

export type ChatSidebarProps = {
  items: readonly ChatSidebarItem[]
  activeId: string
  userName: string
  userAvatar?: ReactNode
  mobileOpen: boolean
  desktopHidden: boolean
  onToggleDesktop: () => void
  onCloseMobile: () => void
  onNewChat: () => void
  onSelect: (id: string) => void
  onPin: (id: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
}

export default function ChatSidebar({
  items,
  activeId,
  userName,
  userAvatar,
  mobileOpen,
  desktopHidden,
  onToggleDesktop,
  onCloseMobile,
  onNewChat,
  onSelect,
  onPin,
  onArchive,
  onDelete,
}: ChatSidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ChatSidebarItem | null>(null)
  const confirmDeleteRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()
  const activeItems = items.filter((item) => !item.archived)
  const pinnedItems = activeItems.filter((item) => item.pinned)
  const recentItems = activeItems.filter((item) => !item.pinned)
  const archivedItems = items.filter((item) => item.archived)

  useEffect(() => {
    if (!deleteTarget) return
    confirmDeleteRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDeleteTarget(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [deleteTarget])

  function renderItem(item: ChatSidebarItem) {
    const menuOpen = openMenuId === item.id
    const isActive = activeId === item.id
    return (
      <li key={item.id} className="group relative">
        <button
          type="button"
          onClick={() => {
            onSelect(item.id)
            onCloseMobile()
            setOpenMenuId(null)
          }}
          title={item.title}
          aria-current={activeId === item.id ? 'page' : undefined}
          className={cn(
            'flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg border px-2.5 pr-9 text-left text-xs transition-colors',
            isActive ? 'border-[var(--chat-accent)]/25 bg-surface/65 text-foreground shadow-sm' : 'border-transparent text-muted hover:border-border/50 hover:bg-surface/40 hover:text-foreground',
            item.archived && 'opacity-70',
          )}
        >
          {item.pinned ? <IconPin size={14} stroke={1.7} className="shrink-0" aria-hidden="true" /> : isActive ? <IconMessageCircleFilled size={15} className="text-[var(--chat-accent)] shrink-0" aria-hidden="true" /> : <IconMessageCircle size={15} stroke={1.6} className="shrink-0" aria-hidden="true" />}
          <span className="min-w-0 flex-1 truncate">{item.title}</span>
        </button>
        <button
          type="button"
          aria-label={`Options for ${item.title}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          title="Chat options"
          onClick={() => setOpenMenuId(menuOpen ? null : item.id)}
          className={cn(
            'text-muted hover:bg-surface hover:text-foreground absolute right-1 top-1 flex size-7 cursor-pointer items-center justify-center rounded-md opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100',
          )}
        >
          <IconDots size={16} stroke={1.8} aria-hidden="true" />
        </button>
        {menuOpen ? (
          <div role="menu" aria-label={`${item.title} actions`} className="border-border/70 bg-background absolute right-1 top-9 z-40 min-w-40 rounded-xl border p-1 shadow-xl">
            {!item.archived ? (
              <>
                <button role="menuitem" type="button" onClick={() => { onPin(item.id); setOpenMenuId(null) }} className="text-muted hover:bg-surface hover:text-foreground flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 text-left text-xs">
                  <IconPin size={14} aria-hidden="true" />{item.pinned ? 'Unpin chat' : 'Pin chat'}
                </button>
                <button role="menuitem" type="button" onClick={() => { onArchive(item.id); setOpenMenuId(null) }} className="text-muted hover:bg-surface hover:text-foreground flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 text-left text-xs">
                  <IconArchive size={14} aria-hidden="true" />Archive chat
                </button>
              </>
            ) : (
              <button role="menuitem" type="button" onClick={() => { onArchive(item.id); setOpenMenuId(null) }} className="text-muted hover:bg-surface hover:text-foreground flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 text-left text-xs">
                <IconRestore size={14} aria-hidden="true" />Restore chat
              </button>
            )}
            <button role="menuitem" type="button" onClick={() => { setDeleteTarget(item); setOpenMenuId(null) }} className="text-rose-400 hover:bg-rose-500/10 flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 text-left text-xs">
              <IconTrash size={14} aria-hidden="true" />Delete chat
            </button>
          </div>
        ) : null}
      </li>
    )
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close chat history"
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        onClick={onCloseMobile}
        className={cn(
          'absolute inset-0 z-20 flex cursor-default bg-black/45 opacity-0 transition-opacity duration-300 ease-out motion-reduce:transition-none md:hidden',
          mobileOpen ? 'visible opacity-100' : 'invisible pointer-events-none',
        )}
      />
      <aside
        aria-label="Chat history"
        className={cn(
          'border-border/70 bg-background absolute inset-y-0 left-0 z-30 flex w-[min(17rem,84vw)] flex-col overflow-hidden border-r shadow-2xl transition-[transform,width,visibility,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:relative md:inset-auto md:z-auto md:w-60 md:shrink-0 md:translate-x-0 md:bg-surface/10 md:shadow-none',
          mobileOpen ? 'visible translate-x-0' : 'invisible -translate-x-full md:visible',
          desktopHidden && 'md:w-14',
        )}
      >
        <div className={cn('border-border/50 flex h-14 shrink-0 items-center gap-2 border-b px-3', desktopHidden && 'md:justify-center md:px-1')}>
          <span className={cn('bg-[var(--chat-accent)] text-white flex size-8 shrink-0 items-center justify-center rounded-xl p-1.5', desktopHidden && 'md:hidden')}>
            <ChatLogo className="size-full" />
          </span>
          <span className={cn('font-display min-w-0 flex-1 truncate text-xs font-semibold', desktopHidden && 'md:hidden')}>istmX chat</span>
          <button type="button" onClick={onToggleDesktop} aria-label={desktopHidden ? 'Expand chat sidebar' : 'Collapse chat sidebar'} title={desktopHidden ? 'Expand sidebar' : 'Collapse sidebar'} className="text-muted hover:text-foreground hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors md:flex">
            {desktopHidden ? <IconLayoutSidebarLeftExpand size={17} stroke={1.7} /> : <IconLayoutSidebarLeftCollapse size={17} stroke={1.7} />}
          </button>
          <button type="button" onClick={onCloseMobile} aria-label="Close chat sidebar" className="text-muted hover:text-foreground ml-auto flex size-8 cursor-pointer items-center justify-center rounded-lg md:hidden">
            <IconX size={16} stroke={1.8} />
          </button>
        </div>

        <div className={cn('px-2 pb-3', desktopHidden && 'md:hidden')}>
          <button
            type="button"
            onClick={onNewChat}
            title="New chat"
            className={cn(
              'border-border/70 text-foreground hover:bg-surface/50 flex h-9 w-full cursor-pointer items-center gap-2 rounded-xl border px-2.5 text-left text-xs transition-colors',
            )}
          >
            <IconPlus size={16} stroke={1.8} aria-hidden="true" />
            <span>New chat</span>
          </button>
        </div>

        <nav aria-label="Chat history" className={cn('[scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3', desktopHidden && 'md:hidden')}>
          {pinnedItems.length ? (
            <section className="mb-3">
              <h3 className="text-muted px-2 pb-1.5 pt-1 font-mono text-[9px] tracking-[0.14em] uppercase">Pinned</h3>
              <ul className="space-y-0.5">{pinnedItems.map(renderItem)}</ul>
            </section>
          ) : null}
          <section>
            <h3 className="text-muted px-2 pb-1.5 pt-1 font-mono text-[9px] tracking-[0.14em] uppercase">Recent chats</h3>
            <ul className="space-y-0.5">{recentItems.map(renderItem)}</ul>
          </section>
          {archivedItems.length ? (
            <section className="mt-3">
              <button type="button" aria-expanded={showArchived} onClick={() => setShowArchived((show) => !show)} className="text-muted hover:text-foreground flex h-8 w-full cursor-pointer items-center gap-2 px-2 text-left font-mono text-[9px] tracking-[0.14em] uppercase">
                <IconArchive size={14} aria-hidden="true" />
                <span>Archived · {archivedItems.length}</span>
              </button>
              {showArchived ? <ul className="space-y-0.5">{archivedItems.map(renderItem)}</ul> : null}
            </section>
          ) : null}
        </nav>

        <div className={cn('border-border/60 mt-auto flex min-h-14 items-center gap-2.5 border-t px-3 py-2.5', desktopHidden && 'md:justify-center md:px-1')}>
          <span className="border-border/60 bg-background relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border">
            {userAvatar ?? <ChatUserAvatar />}
          </span>
          <span className={cn('min-w-0 flex-1', desktopHidden && 'md:hidden')}>
            <span className="text-foreground block truncate text-xs font-medium">{userName}</span>
            <span className="text-muted mt-0.5 block truncate text-[10px]">Preview account</span>
          </span>
        </div>
      </aside>
      {typeof document !== 'undefined' ? createPortal(
        <AnimatePresence>
          {deleteTarget ? (
            <motion.div
              className="fixed inset-0 z-[600] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.16 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setDeleteTarget(null)
              }}
            >
              <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" aria-hidden="true" />
              <motion.section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-chat-title"
                aria-describedby="delete-chat-description"
                className="border-border/70 bg-background relative z-10 w-full max-w-sm rounded-2xl border p-5 shadow-2xl"
                initial={reduceMotion ? { scale: 1 } : { opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
              >
                <h2 id="delete-chat-title" className="font-display text-base font-semibold">Delete this chat?</h2>
                <p id="delete-chat-description" className="text-muted mt-2 text-sm leading-5">
                  “{deleteTarget.title}” will be permanently deleted. This can’t be undone.
                </p>
                <div className="mt-5 flex justify-end gap-2">
                  <button type="button" onClick={() => setDeleteTarget(null)} className="border-border/70 text-muted hover:bg-surface hover:text-foreground h-9 cursor-pointer rounded-lg border px-3 text-xs font-medium transition-colors">Cancel</button>
                  <button
                    ref={confirmDeleteRef}
                    type="button"
                    onClick={() => {
                      onDelete(deleteTarget.id)
                      setDeleteTarget(null)
                    }}
                    className="bg-rose-500 text-white hover:bg-rose-400 h-9 cursor-pointer rounded-lg px-3 text-xs font-semibold transition-colors"
                  >
                    Delete chat
                  </button>
                </div>
              </motion.section>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      ) : null}
    </>
  )
}
