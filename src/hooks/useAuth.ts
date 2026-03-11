import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, profile, loading, signOut, initialized } = useAuthStore()
  const isAdmin = profile?.role === 'admin'
  const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
  const isPremium = profile?.subscription_tier === 'premium'

  return { user, profile, loading, signOut, initialized, isAdmin, isSubscribed, isPremium }
}
