import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/utils/validators'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/store/uiStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type SignupForm = { email: string; password: string; confirmPassword: string }

export default function SignupPage() {
  const { signUpWithEmail, signInWithGoogle, loading } = useAuthStore()
  const toast = useToast()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupForm) => {
    try {
      await signUpWithEmail(data.email, data.password)
      setSent(true)
      toast.success('Check your email to confirm your account')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Signup failed')
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch {
      toast.error('Google sign-in failed')
      setGoogleLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-charcoal p-4">
        <div className="bg-graphite border border-smoke rounded-2xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-turf/15 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-turf" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-sm text-white/50 mb-6">
            We sent a confirmation link to your email. Click it to activate your account.
          </p>
          <Link to="/login">
            <Button variant="secondary" className="w-full">Back to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-charcoal p-4">
      <div className="bg-graphite border border-smoke rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">
            <span className="text-amber text-glow-amber">SOS</span>{' '}
            <span className="text-white">TRAIN</span>
          </h1>
          <p className="text-sm text-white/40">Create your account</p>
        </div>

        {/* Google OAuth */}
        <Button
          variant="secondary"
          className="w-full mb-6"
          onClick={handleGoogle}
          loading={googleLoading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-smoke" />
          <span className="text-xs text-white/30 uppercase">or</span>
          <div className="flex-1 h-px bg-smoke" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" className="w-full" loading={loading}>
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{' '}
          <Link to="/login" className="text-amber hover:text-blaze transition-colors font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
