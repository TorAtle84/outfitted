'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AvatarCustomization } from '@/types'
import { normalizeAvatarCustomization } from '@/lib/avatar'

type AvatarApiResponse =
  | { avatar: AvatarCustomization | null }
  | { error: string }

export function useAvatar() {
  const [avatar, setAvatar] = useState<AvatarCustomization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/avatar', { method: 'GET' })
      const data = (await res.json().catch(() => null)) as AvatarApiResponse | null

      if (!res.ok) {
        setAvatar(null)
        setError(data && 'error' in data ? data.error : 'Kunne ikke hente avatar')
        return
      }

      setAvatar(data && 'avatar' in data && data.avatar ? normalizeAvatarCustomization(data.avatar) : null)
    } catch {
      setAvatar(null)
      setError('Kunne ikke hente avatar')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const save = useCallback(async (nextAvatar: AvatarCustomization) => {
    setError(null)

    try {
      const res = await fetch('/api/avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextAvatar),
      })

      const data = (await res.json().catch(() => null)) as AvatarApiResponse | null

      if (!res.ok) {
        const message = data && 'error' in data ? data.error : 'Kunne ikke lagre avatar'
        setError(message)
        return { ok: false as const, error: message }
      }

      const saved = data && 'avatar' in data && data.avatar ? normalizeAvatarCustomization(data.avatar) : normalizeAvatarCustomization(nextAvatar)
      setAvatar(saved)
      return { ok: true as const }
    } catch {
      const message = 'Kunne ikke lagre avatar'
      setError(message)
      return { ok: false as const, error: message }
    }
  }, [])

  return {
    avatar,
    isLoading,
    error,
    reload,
    save,
  }
}

