import { useAuthStore } from '@/store/authStore'

export function useSubscription() {
  const profile = useAuthStore((s) => s.profile)

  const tier = profile?.subscription_tier || 'none'
  const status = profile?.subscription_status
  const isActive = status === 'active' || status === 'trialing'
  const isPremium = tier === 'premium' && isActive
  const isMember = (tier === 'member' || tier === 'premium') && isActive

  return {
    tier,
    status,
    isActive,
    isPremium,
    isMember,
    isLoading: !profile,
    stripeCustomerId: profile?.stripe_customer_id,
  }
}
