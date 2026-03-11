import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface SubscriptionGateProps {
  children: React.ReactNode
  requireTier?: 'member' | 'premium'
}

export default function SubscriptionGate({ children, requireTier = 'member' }: SubscriptionGateProps) {
  const profile = useAuthStore((s) => s.profile)

  if (!profile) return null

  const isActive = profile.subscription_status === 'active' || profile.subscription_status === 'trialing'

  if (!isActive) {
    return <Navigate to="/pricing" replace />
  }

  if (requireTier === 'premium' && profile.subscription_tier !== 'premium') {
    return <Navigate to="/pricing" replace />
  }

  return <>{children}</>
}
