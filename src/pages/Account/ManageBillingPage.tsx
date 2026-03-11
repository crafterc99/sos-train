import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useSubscription } from '@/hooks/useSubscription'
import { useToast } from '@/store/uiStore'
import { supabase } from '@/lib/supabase'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatShort } from '@/utils/formatDate'

export default function ManageBillingPage() {
  const { profile } = useAuthStore()
  const { tier, status, isActive, isPremium } = useSubscription()
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { returnUrl: window.location.origin + '/account/subscription' },
      })
      if (error) throw error
      if (data?.url) window.location.href = data.url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to open billing portal')
    } finally {
      setLoading(false)
    }
  }

  const tierBadge = () => {
    if (isPremium) return <Badge variant="premium">Premium</Badge>
    if (tier === 'member' && isActive) return <Badge variant="amber">Member</Badge>
    return <Badge variant="info">Free</Badge>
  }

  const statusBadge = () => {
    if (status === 'active') return <Badge variant="success">Active</Badge>
    if (status === 'trialing') return <Badge variant="amber">Trial</Badge>
    if (status === 'canceled') return <Badge variant="danger">Canceled</Badge>
    if (status === 'past_due') return <Badge variant="danger">Past Due</Badge>
    return <Badge variant="info">Inactive</Badge>
  }

  return (
    <PageWrapper title="Subscription" subtitle="Manage your plan and billing">
      <div className="max-w-2xl space-y-6">
        {/* Current Plan */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">Current Plan</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-white capitalize">{tier === 'none' ? 'No Plan' : tier}</span>
                {tierBadge()}
                {statusBadge()}
              </div>
            </div>
          </div>

          {profile?.subscription_period_end && (
            <p className="text-sm text-white/40 mt-2">
              {status === 'canceled' ? 'Access until' : 'Next billing date'}:{' '}
              <span className="text-white/60">{formatShort(profile.subscription_period_end)}</span>
            </p>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {isActive && (
              <Button
                variant="secondary"
                loading={loading}
                onClick={handleManageBilling}
              >
                Manage Billing
              </Button>
            )}
            {!isActive && (
              <a href="/pricing">
                <Button>View Plans</Button>
              </a>
            )}
          </div>
        </Card>

        {/* Plan Features */}
        <Card>
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">
            {isActive ? 'Your Plan Includes' : 'Upgrade to Access'}
          </h3>
          <ul className="space-y-3">
            {[
              'Full workout library & programs',
              'Community feed & leaderboards',
              'Weekly check-ins with coach',
              'Locker Room content',
              ...(isPremium
                ? ['Live coaching sessions', '1-on-1 video calls', 'Priority feedback', 'Exclusive content']
                : []),
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-white/60">
                <svg className="w-4 h-4 text-amber shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageWrapper>
  )
}
