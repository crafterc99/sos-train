import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Spinner from '@/components/ui/Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, profile, initialized } = useAuthStore()
  const location = useLocation()

  if (!initialized) return <Spinner className="min-h-screen" />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (profile && !profile.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  if (requireAdmin && profile?.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <>{children}</>
}
