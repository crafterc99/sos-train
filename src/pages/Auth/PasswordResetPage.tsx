import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '@/utils/validators'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/store/uiStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type ResetForm = { email: string }

export default function PasswordResetPage() {
  const { resetPassword, loading } = useAuthStore()
  const toast = useToast()
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetForm) => {
    try {
      await resetPassword(data.email)
      setSent(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email')
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-charcoal p-4">
      <div className="bg-graphite border border-smoke rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">
            <span className="text-amber text-glow-amber">SOS</span>{' '}
            <span className="text-white">TRAIN</span>
          </h1>
          <p className="text-sm text-white/40">
            {sent ? 'Check your email' : 'Reset your password'}
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-turf/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-turf" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-white/50 mb-6">
              If an account with that email exists, we sent a reset link.
            </p>
            <Link to="/login">
              <Button variant="secondary" className="w-full">Back to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Button type="submit" className="w-full" loading={loading}>
              Send Reset Link
            </Button>
            <p className="text-center text-sm text-white/40">
              <Link to="/login" className="text-amber hover:text-blaze transition-colors">
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
