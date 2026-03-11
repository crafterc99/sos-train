import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

export default function SubscriptionSuccessPage() {
  const navigate = useNavigate()
  const { refreshProfile, profile } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function sync() {
      await refreshProfile()
      setLoading(false)
    }
    // Give Stripe webhook a moment to process
    const timer = setTimeout(sync, 2000)
    return () => clearTimeout(timer)
  }, [refreshProfile])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-charcoal p-4">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-white/40">Activating your subscription...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-charcoal p-4">
      <div className="bg-graphite border border-amber/30 rounded-2xl p-8 w-full max-w-md text-center glow-amber">
        <div className="w-20 h-20 rounded-full bg-amber/15 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-amber" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-white mb-2">You're In!</h1>
        <p className="text-sm text-white/50 mb-2">
          Welcome to <span className="text-amber font-bold">SOS TRAIN</span>
          {profile?.subscription_tier === 'premium' && ' Premium'}
        </p>
        <p className="text-xs text-white/30 mb-8">
          Your subscription is now active. Time to train.
        </p>

        <Button className="w-full" onClick={() => navigate('/dashboard', { replace: true })}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
