'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AvatarCreator } from '@/components/avatar'
import { useAvatar } from '@/hooks/useAvatar'
import type { AvatarCustomization } from '@/types'
import { Button, Card } from '@/components/ui'

export default function AvatarEditorClient() {
  const router = useRouter()
  const { avatar, isLoading, error, save } = useAvatar()
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async (data: AvatarCustomization) => {
    setIsSaving(true)
    setSaveError(null)

    const result = await save(data)

    if (!result.ok) {
      setSaveError(result.error)
      setIsSaving(false)
      return
    }

    router.push('/profile')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream p-6 flex items-center justify-center">
        <p className="text-taupe">Laster avatar...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Avatar</h1>
            <p className="text-sm text-taupe">Tilpass figuren din slik at den føles som deg.</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/profile')}>
            Tilbake
          </Button>
        </div>

        {(error || saveError) && (
          <Card className="mb-4 border border-rose/30 bg-blush/50">
            <p className="text-sm text-charcoal">
              {saveError || error}
            </p>
          </Card>
        )}

        <AvatarCreator
          initialData={avatar ?? undefined}
          onSave={handleSave}
          onCancel={() => router.push('/profile')}
        />

        {isSaving && (
          <div className="fixed inset-0 bg-black/10 flex items-center justify-center">
            <Card variant="elevated">
              <p className="text-charcoal">Lagrer avatar...</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

