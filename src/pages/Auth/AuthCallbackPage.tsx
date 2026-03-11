import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import Spinner from '@/components/ui/Spinner'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const refreshProfile = useAuthStore((s) => s.refreshProfile)

  useEffect(() => {
    async function handleCallback() {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) throw error

        await refreshProfile()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single()

          if (profile?.onboarding_completed) {
            navigate('/dashboard', { replace: true })
          } else {
            navigate('/onboarding', { replace: true })
          }
        }
      } catch {
        navigate('/login', { replace: true })
      }
    }
    handleCallback()
  }, [navigate, refreshProfile])

  return <Spinner className="min-h-screen" />
}
