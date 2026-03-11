import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/store/uiStore'
import { supabase } from '@/lib/supabase'
import { compressImage } from '@/utils/imageCompressor'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import clsx from 'clsx'

const FITNESS_GOALS = [
  { id: 'lose-weight', label: 'Lose Weight', icon: '🔥' },
  { id: 'build-muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'improve-endurance', label: 'Improve Endurance', icon: '🏃' },
  { id: 'athletic-performance', label: 'Athletic Performance', icon: '⚡' },
  { id: 'general-fitness', label: 'General Fitness', icon: '🎯' },
]

const PROGRAM_PREFERENCES = [
  { id: 'self-guided', label: 'Self-Guided', desc: 'Train on your own schedule with structured programs' },
  { id: 'coach-led', label: 'Coach-Led', desc: 'Follow the coach\'s recommended plan step by step' },
  { id: 'group-training', label: 'Group Training', desc: 'Join live group sessions and train with the community' },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuthStore()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(1)
  const [goals, setGoals] = useState<string[]>([])
  const [programPref, setProgramPref] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarUrl(URL.createObjectURL(file))
  }

  const handleComplete = async () => {
    if (!user) return
    setLoading(true)

    try {
      let uploadedAvatarUrl: string | null = null

      if (avatarFile) {
        const compressed = await compressImage(avatarFile, 400, 0.85)
        const filePath = `${user.id}/avatar.jpg`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, compressed, { upsert: true, contentType: 'image/jpeg' })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)
        uploadedAvatarUrl = urlData.publicUrl
      }

      await updateProfile({
        fitness_goals: goals,
        program_preference: programPref,
        display_name: displayName.trim(),
        avatar_url: uploadedAvatarUrl,
        onboarding_completed: true,
      })

      toast.success('Welcome to SOS Train!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return goals.length > 0
    if (step === 2) return programPref !== ''
    if (step === 3) return displayName.trim().length >= 2
    return false
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-charcoal p-4">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-smoke">
              <div
                className={clsx(
                  'h-full rounded-full transition-all duration-500',
                  s <= step ? 'bg-gradient-to-r from-amber to-ember w-full' : 'w-0'
                )}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Fitness Goals */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-graphite border border-smoke rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">What are your goals?</h2>
              <p className="text-sm text-white/40 mb-6">Select all that apply</p>

              <div className="space-y-3">
                {FITNESS_GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={clsx(
                      'w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left',
                      goals.includes(goal.id)
                        ? 'border-amber bg-amber/10 text-white'
                        : 'border-smoke bg-charcoal text-white/60 hover:border-smoke hover:text-white'
                    )}
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="font-semibold text-sm">{goal.label}</span>
                    {goals.includes(goal.id) && (
                      <svg className="w-5 h-5 text-amber ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              <Button
                className="w-full mt-6"
                disabled={!canProceed()}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Program Preference */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-graphite border border-smoke rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">How do you train?</h2>
              <p className="text-sm text-white/40 mb-6">Choose your preferred training style</p>

              <div className="space-y-3">
                {PROGRAM_PREFERENCES.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => setProgramPref(pref.id)}
                    className={clsx(
                      'w-full p-4 rounded-xl border transition-all duration-200 text-left',
                      programPref === pref.id
                        ? 'border-amber bg-amber/10'
                        : 'border-smoke bg-charcoal hover:border-smoke'
                    )}
                  >
                    <p className="font-semibold text-sm text-white">{pref.label}</p>
                    <p className="text-xs text-white/40 mt-1">{pref.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="flex-1" disabled={!canProceed()} onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Profile Setup */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-graphite border border-smoke rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Set up your profile</h2>
              <p className="text-sm text-white/40 mb-6">Let the community know who you are</p>

              {/* Avatar upload */}
              <div className="flex flex-col items-center mb-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full overflow-hidden bg-smoke border-2 border-dashed border-smoke hover:border-amber transition-colors flex items-center justify-center"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <p className="text-xs text-white/30 mt-2">Tap to add a photo (optional)</p>
              </div>

              <Input
                label="Display Name"
                placeholder="What should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />

              <div className="flex gap-3 mt-6">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  className="flex-1"
                  disabled={!canProceed()}
                  loading={loading}
                  onClick={handleComplete}
                >
                  Let's Go
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
