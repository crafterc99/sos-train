import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/store/uiStore'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import clsx from 'clsx'

type Interval = 'monthly' | 'annual'

const PLANS = [
  {
    tier: 'member',
    name: 'Member',
    monthly: 29,
    annual: 249,
    annualSavings: 99,
    features: [
      'Full workout library',
      'Training programs',
      'Exercise demos & cues',
      'Community access',
      'Leaderboards',
      'Weekly check-ins',
      'Locker Room content',
    ],
  },
  {
    tier: 'premium',
    name: 'Premium',
    monthly: 59,
    annual: 499,
    annualSavings: 209,
    popular: true,
    features: [
      'Everything in Member',
      'Live group workouts',
      '1-on-1 coaching sessions',
      'Priority check-in reviews',
      'Exclusive content library',
      'Challenges & competitions',
      'Direct messaging with coach',
    ],
  },
]

export default function PricingPage() {
  const navigate = useNavigate()
  const { user, profile } = useAuthStore()
  const toast = useToast()
  const [interval, setInterval] = useState<Interval>('monthly')
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  const handleSubscribe = async (tier: string) => {
    if (!user) {
      navigate('/signup')
      return
    }

    setLoadingTier(tier)
    try {
      const priceKey = `${tier}_${interval}`
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceKey, returnUrl: window.location.origin },
      })

      if (error) throw error
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start checkout')
    } finally {
      setLoadingTier(null)
    }
  }

  const isCurrentPlan = (tier: string) => {
    return profile?.subscription_tier === tier && profile?.subscription_status === 'active'
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-charcoal py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-amber text-glow-amber">Choose</span>{' '}
            <span className="text-white">Your Plan</span>
          </h1>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Train like your life depends on it. Cancel anytime.
          </p>
        </div>

        {/* Interval toggle */}
        <div className="flex items-center justify-center gap-1 mb-10">
          <button
            onClick={() => setInterval('monthly')}
            className={clsx(
              'px-5 py-2 rounded-l-xl text-sm font-semibold transition-all',
              interval === 'monthly'
                ? 'bg-amber text-charcoal'
                : 'bg-graphite text-white/50 hover:text-white'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('annual')}
            className={clsx(
              'px-5 py-2 rounded-r-xl text-sm font-semibold transition-all flex items-center gap-2',
              interval === 'annual'
                ? 'bg-amber text-charcoal'
                : 'bg-graphite text-white/50 hover:text-white'
            )}
          >
            Annual
            <Badge variant="success">Save</Badge>
          </button>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={clsx(
                'bg-graphite border rounded-2xl p-8 relative transition-all',
                plan.popular
                  ? 'border-amber glow-amber'
                  : 'border-smoke'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="premium">Most Popular</Badge>
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-white">
                  ${interval === 'monthly' ? plan.monthly : plan.annual}
                </span>
                <span className="text-white/30 text-sm">
                  /{interval === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>

              {interval === 'annual' && (
                <p className="text-xs text-turf mb-4">
                  Save ${plan.annualSavings}/year
                </p>
              )}
              {interval === 'monthly' && <div className="mb-4" />}

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/70">
                    <svg className="w-4 h-4 text-amber shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrentPlan(plan.tier) ? (
                <Button variant="secondary" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={plan.popular ? 'primary' : 'outline'}
                  loading={loadingTier === plan.tier}
                  onClick={() => handleSubscribe(plan.tier)}
                >
                  {user ? 'Subscribe' : 'Get Started'}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/20 mt-8">
          All plans include a 7-day free trial. Cancel anytime from your account.
        </p>
      </div>
    </div>
  )
}
