'use client'

import { useEffect, useState } from 'react'

type GitHubProfile = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
}

export default function GitHubProfileEmbed() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('https://api.github.com/users/istmX', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('GitHub profile unavailable')
        return response.json() as Promise<GitHubProfile>
      })
      .then(setProfile)
      .catch(() => {})

    return () => controller.abort()
  }, [])

  return (
    <div className="mt-4 rounded-xl border border-border/70 bg-surface/45 p-3">
      <div className="flex items-center gap-3">
        {profile?.avatar_url ? (
          // GitHub supplies this public avatar URL as part of the profile response.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full border border-border/70 object-cover"
          />
        ) : (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background text-sm font-semibold text-foreground">
            {profile ? 'A' : '…'}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {profile?.name || 'Aryan'}
          </p>
          <p className="truncate text-xs text-muted">@{profile?.login || 'istmX'}</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 min-h-8 text-xs leading-4 text-muted">
        {profile?.bio || 'Developer in India focused on AI engineering.'}
      </p>
      {profile && (
        <div className="mt-3 flex gap-4 border-t border-border/60 pt-3 text-[11px] text-muted">
          <span><strong className="font-semibold text-foreground">{profile.public_repos}</strong> repositories</span>
          <span><strong className="font-semibold text-foreground">{profile.followers}</strong> followers</span>
        </div>
      )}
    </div>
  )
}
