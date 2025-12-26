'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Button, Card } from '@/components/ui'
import { AvatarDisplay } from '@/components/avatar'
import { useAvatar } from '@/hooks/useAvatar'

interface ProfileClientProps {
  user: User
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)
  const { avatar } = useAvatar()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <header className="bg-beige border-b border-beige">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-charcoal">Profile</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-blush rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Profile Card */}
        <Card variant="elevated" className="mb-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-blush rounded-full flex items-center justify-center mb-4">
              <AvatarDisplay
                size="sm"
                skinTone={avatar?.skinTone}
                hairColor={avatar?.hairColor}
                hairHighlights={avatar?.hairHighlights}
                hairStyle={avatar?.hairStyle}
                eyeColor={avatar?.eyeColor}
                faceShape={avatar?.faceShape}
                bodyType={avatar?.bodyType}
                height={avatar?.height}
                accessories={avatar?.accessories}
              />
            </div>
            <h2 className="text-xl font-bold text-charcoal">
              {user.user_metadata?.name || 'User'}
            </h2>
            <p className="text-taupe text-sm">{user.email}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => router.push('/profile/avatar')}
            >
              Edit Avatar
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Your Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-charcoal">0</p>
              <p className="text-xs text-taupe">Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">0</p>
              <p className="text-xs text-taupe">Outfits</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">0</p>
              <p className="text-xs text-taupe">Posts</p>
            </div>
          </div>
        </Card>

        {/* Subscription */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-charcoal">Free Trial</h3>
              <p className="text-sm text-taupe">90 days remaining</p>
            </div>
            <Button size="sm">Upgrade</Button>
          </div>
        </Card>

        {/* Settings (conditional) */}
        {showSettings && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-charcoal mb-4">Settings</h3>
            <div className="space-y-4">
              {/* Location Settings */}
              <div className="pb-4 border-b border-beige">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Your City
                </label>
                <input
                  type="text"
                  placeholder="e.g., Oslo, London, New York"
                  defaultValue={user.user_metadata?.city || ''}
                  className="w-full px-3 py-2 rounded-lg border border-beige bg-white text-charcoal placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-rose focus:border-transparent"
                />
                <p className="mt-1 text-xs text-taupe">
                  Used for weather-based outfit suggestions
                </p>
              </div>

              <SettingToggle
                label="Push Notifications"
                description="Daily outfit reminders at 5:00 AM"
                defaultChecked={true}
              />
              <SettingToggle
                label="Sustainability Tracking"
                description="Get reminders about unused items"
                defaultChecked={true}
              />
              <SettingToggle
                label="Seasonal Rotation"
                description="Auto-suggest seasonal wardrobe updates"
                defaultChecked={true}
              />
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <QuickAction
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
              </svg>
            }
            label="Help & Support"
            href="#"
          />
          <QuickAction
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            }
            label="Terms of Service"
            href="#"
          />
          <QuickAction
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            }
            label="Privacy Policy"
            href="#"
          />
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full mt-8 text-red-500 hover:bg-red-50"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-beige">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-around">
            <NavItem href="/home" icon="home" label="Home" />
            <NavItem href="/wardrobe" icon="wardrobe" label="Wardrobe" />
            <NavItem href="/profile" icon="profile" label="Profile" active />
          </div>
        </div>
      </nav>
    </div>
  )
}

function SettingToggle({
  label,
  description,
  defaultChecked,
}: {
  label: string
  description: string
  defaultChecked?: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked || false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-charcoal">{label}</p>
        <p className="text-xs text-taupe">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-rose' : 'bg-beige'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}

function QuickAction({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="flex items-center gap-4 hover:bg-blush/50 transition-colors cursor-pointer">
        <div className="w-10 h-10 bg-blush rounded-full flex items-center justify-center text-rose">
          {icon}
        </div>
        <span className="font-medium text-charcoal">{label}</span>
        <svg
          className="w-5 h-5 text-taupe ml-auto"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Card>
    </Link>
  )
}

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string
  icon: string
  label: string
  active?: boolean
}) {
  const icons = {
    home: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    wardrobe: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    profile: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  }

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 ${
        active ? 'text-rose' : 'text-taupe hover:text-charcoal'
      }`}
    >
      {icons[icon as keyof typeof icons]}
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}
