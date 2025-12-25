'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Card } from '@/components/ui'

interface Stats {
  totalUsers: number
  promoUsers: number
  premiumUsers: number
  totalClothes: number
  totalOutfits: number
  recentSignups: number
}

interface PromoUser {
  id: string
  grantedBy: string
  reason: string | null
  expiresAt: string | null
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
  }
}

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  subscription: { tier: string } | null
  promoAccess: { id: string } | null
  _count: {
    clothes: number
    outfits: number
  }
}

export default function AdminDashboard({ adminEmail }: { adminEmail: string }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'promo'>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [promoUsers, setPromoUsers] = useState<PromoUser[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // Promo form
  const [promoEmail, setPromoEmail] = useState('')
  const [promoReason, setPromoReason] = useState('')
  const [promoExpires, setPromoExpires] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

  useEffect(() => {
    loadStats()
    loadPromoUsers()
  }, [])

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    }
  }, [activeTab, userSearch])

  async function loadStats() {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        setStats(await res.json())
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadPromoUsers() {
    try {
      const res = await fetch('/api/admin/promo')
      if (res.ok) {
        const data = await res.json()
        setPromoUsers(data.promoUsers)
      }
    } catch (error) {
      console.error('Failed to load promo users:', error)
    }
  }

  async function loadUsers() {
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(userSearch)}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  async function addPromoUser(e: React.FormEvent) {
    e.preventDefault()
    setPromoLoading(true)
    setPromoError('')
    setPromoSuccess('')

    try {
      const res = await fetch('/api/admin/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: promoEmail,
          reason: promoReason || null,
          expiresAt: promoExpires || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setPromoError(data.error)
      } else {
        setPromoSuccess(`Promo access granted to ${promoEmail}`)
        setPromoEmail('')
        setPromoReason('')
        setPromoExpires('')
        loadPromoUsers()
      }
    } catch {
      setPromoError('An error occurred')
    } finally {
      setPromoLoading(false)
    }
  }

  async function removePromoUser(promoId: string) {
    if (!confirm('Are you sure you want to remove promo access?')) return

    try {
      const res = await fetch(`/api/admin/promo?id=${promoId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        loadPromoUsers()
      }
    } catch (error) {
      console.error('Failed to remove promo:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-taupe">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal">Admin Dashboard</h1>
          <p className="text-taupe">Logged in as {adminEmail}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === 'overview' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'users' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('users')}
          >
            Users
          </Button>
          <Button
            variant={activeTab === 'promo' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('promo')}
          >
            Promo Access
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-charcoal mb-2">Total Users</h3>
              <p className="text-4xl font-bold text-rose">{stats.totalUsers}</p>
              <p className="text-sm text-taupe mt-2">+{stats.recentSignups} last 7 days</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-charcoal mb-2">Promo Users</h3>
              <p className="text-4xl font-bold text-sage">{stats.promoUsers}</p>
              <p className="text-sm text-taupe mt-2">Free premium access</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-charcoal mb-2">Premium Users</h3>
              <p className="text-4xl font-bold text-dusty-rose">{stats.premiumUsers}</p>
              <p className="text-sm text-taupe mt-2">Paying customers</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-charcoal mb-2">Total Clothes</h3>
              <p className="text-4xl font-bold text-charcoal">{stats.totalClothes}</p>
              <p className="text-sm text-taupe mt-2">Across all wardrobes</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-charcoal mb-2">Total Outfits</h3>
              <p className="text-4xl font-bold text-charcoal">{stats.totalOutfits}</p>
              <p className="text-sm text-taupe mt-2">Saved outfits</p>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-6">
              <Input
                placeholder="Search by email or name..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-beige">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Clothes</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Outfits</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-cream/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-charcoal">{user.name || 'No name'}</p>
                          <p className="text-sm text-taupe">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {user.role === 'ADMIN' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            Admin
                          </span>
                        )}
                        {user.promoAccess && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            Promo
                          </span>
                        )}
                        {user.subscription?.tier === 'PREMIUM' && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                            Premium
                          </span>
                        )}
                        {!user.promoAccess && user.subscription?.tier !== 'PREMIUM' && user.role !== 'ADMIN' && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-charcoal">{user._count.clothes}</td>
                      <td className="px-4 py-3 text-charcoal">{user._count.outfits}</td>
                      <td className="px-4 py-3 text-taupe text-sm">
                        {new Date(user.createdAt).toLocaleDateString('en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Promo Tab */}
        {activeTab === 'promo' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Promo Form */}
            <Card>
              <h2 className="text-xl font-semibold text-charcoal mb-6">Add Promo User</h2>
              <form onSubmit={addPromoUser} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  value={promoEmail}
                  onChange={(e) => setPromoEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                />
                <Input
                  label="Reason (optional)"
                  value={promoReason}
                  onChange={(e) => setPromoReason(e.target.value)}
                  placeholder="e.g. Influencer, Beta tester, Friend"
                />
                <Input
                  label="Expires (optional)"
                  type="date"
                  value={promoExpires}
                  onChange={(e) => setPromoExpires(e.target.value)}
                />

                {promoError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {promoError}
                  </div>
                )}
                {promoSuccess && (
                  <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
                    {promoSuccess}
                  </div>
                )}

                <Button type="submit" className="w-full" isLoading={promoLoading}>
                  Add promo access
                </Button>
              </form>
            </Card>

            {/* Promo Users List */}
            <Card>
              <h2 className="text-xl font-semibold text-charcoal mb-6">
                Active Promo Users ({promoUsers.length})
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {promoUsers.length === 0 ? (
                  <p className="text-taupe text-center py-4">No promo users yet</p>
                ) : (
                  promoUsers.map((promo) => (
                    <div
                      key={promo.id}
                      className="flex items-center justify-between p-3 bg-cream rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-charcoal">
                          {promo.user.name || promo.user.email}
                        </p>
                        <p className="text-sm text-taupe">{promo.user.email}</p>
                        {promo.reason && (
                          <p className="text-xs text-sage mt-1">{promo.reason}</p>
                        )}
                        {promo.expiresAt && (
                          <p className="text-xs text-amber-600 mt-1">
                            Expires: {new Date(promo.expiresAt).toLocaleDateString('en-US')}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => removePromoUser(promo.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
