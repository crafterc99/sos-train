import { useState, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/store/uiStore'
import { supabase } from '@/lib/supabase'
import { compressImage } from '@/utils/imageCompressor'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { formatShort } from '@/utils/formatDate'

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuthStore()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [loading, setLoading] = useState(false)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setLoading(true)
    try {
      const compressed = await compressImage(file, 400, 0.85)
      const filePath = `${user.id}/avatar.jpg`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressed, { upsert: true, contentType: 'image/jpeg' })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      await updateProfile({ avatar_url: urlData.publicUrl })
      toast.success('Avatar updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update avatar')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ display_name: displayName.trim() })
      toast.success('Profile updated')
      setEditing(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const tierBadge = () => {
    if (profile?.subscription_tier === 'premium') return <Badge variant="premium">Premium</Badge>
    if (profile?.subscription_tier === 'member') return <Badge variant="amber">Member</Badge>
    return <Badge variant="info">Free</Badge>
  }

  return (
    <PageWrapper title="Profile" subtitle="Manage your account">
      <div className="max-w-2xl space-y-6">
        {/* Profile Card */}
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar
                src={profile?.avatar_url}
                name={profile?.display_name}
                size="lg"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber text-charcoal flex items-center justify-center text-xs hover:bg-blaze transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-white">
                  {profile?.display_name || 'Member'}
                </h2>
                {tierBadge()}
              </div>
              <p className="text-sm text-white/40">{profile?.email}</p>
              <p className="text-xs text-white/20 mt-1">
                Joined {profile?.created_at ? formatShort(profile.created_at) : '—'}
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          {editing && (
            <div className="mt-6 pt-6 border-t border-smoke space-y-4">
              <Input
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Button loading={loading} onClick={handleSave} size="sm">
                Save Changes
              </Button>
            </div>
          )}
        </Card>

        {/* Fitness Goals */}
        <Card>
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">Fitness Goals</h3>
          <div className="flex flex-wrap gap-2">
            {profile?.fitness_goals?.length ? (
              profile.fitness_goals.map((goal) => (
                <Badge key={goal} variant="amber">
                  {goal.replace(/-/g, ' ')}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-white/30">No goals set</p>
            )}
          </div>
        </Card>

        {/* Training Preference */}
        <Card>
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">Training Preference</h3>
          <p className="text-sm text-white/60">
            {profile?.program_preference?.replace(/-/g, ' ') || 'Not set'}
          </p>
        </Card>

        {/* Subscription */}
        <Card>
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">Subscription</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold capitalize">
                {profile?.subscription_tier === 'none' ? 'No active plan' : `${profile?.subscription_tier} Plan`}
              </p>
              <p className="text-xs text-white/30">
                Status: <span className="capitalize">{profile?.subscription_status || 'inactive'}</span>
              </p>
            </div>
            <a href="/account/subscription">
              <Button variant="outline" size="sm">Manage</Button>
            </a>
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}
