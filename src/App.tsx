import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import SubscriptionGate from '@/components/auth/SubscriptionGate'
import ToastContainer from '@/components/ui/ToastContainer'
import Spinner from '@/components/ui/Spinner'

// Placeholder pages (will be replaced with real implementations)
import {
  DashboardPage, ProgramsPage, ProgramDetailPage, WorkoutDetailPage,
  ExercisesPage, ExerciseDetailPage, ProgressPage, WorkoutLogPage,
  WorkoutHistoryPage, HabitTrackerPage, CommunityPage, TransformationPage,
  LeaderboardPage, LockerRoomPage, CheckInPage, CheckInHistoryPage,
  LiveSessionsPage, LiveCallPage, MessagesPage, ChallengesPage,
  ChallengeDetailPage, StorePage, ProductDetailPage, OrderHistoryPage,
  EventsPage, EventDetailPage, ExclusiveContentPage, ProfilePage,
  ManageBillingPage, SettingsPage, PricingPage, SubscriptionSuccessPage,
  AdminDashboardPage, AdminProgramsPage, AdminWorkoutsPage, AdminExercisesPage,
  AdminMembersPage, AdminCheckInsPage, AdminLiveSessionsPage, AdminLockerRoomPage,
  AdminStorePage, AdminOrdersPage, AdminEventsPage, AdminChallengesPage,
  AdminBroadcastPage,
} from '@/pages/placeholder'

// Auth pages placeholder
function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal p-4">
      <div className="bg-graphite border border-smoke rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-black mb-2">
          <span className="text-amber text-glow-amber">SOS</span>{' '}
          <span className="text-white">TRAIN</span>
        </h1>
        <p className="text-white/40 text-sm">Login page — coming in Phase 1B</p>
      </div>
    </div>
  )
}

function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal p-4">
      <div className="bg-graphite border border-smoke rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-black mb-2">
          <span className="text-amber text-glow-amber">SOS</span>{' '}
          <span className="text-white">TRAIN</span>
        </h1>
        <p className="text-white/40 text-sm">Signup page — coming in Phase 1B</p>
      </div>
    </div>
  )
}

function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal p-4">
      <div className="bg-graphite border border-smoke rounded-2xl p-8 w-full max-w-md text-center">
        <p className="text-white/40 text-sm">Onboarding — coming in Phase 1B</p>
      </div>
    </div>
  )
}

function AuthCallbackPage() {
  return <Spinner className="min-h-screen" />
}

function PasswordResetPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal p-4">
      <div className="bg-graphite border border-smoke rounded-2xl p-8 w-full max-w-md text-center">
        <p className="text-white/40 text-sm">Password reset — coming in Phase 1B</p>
      </div>
    </div>
  )
}

// Landing page
function LandingPage() {
  const user = useAuthStore((s) => s.user)
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          <span className="text-amber text-glow-amber">SOS</span>{' '}
          <span className="text-white">TRAIN</span>
        </h1>
        <p className="text-xl text-white/60 font-semibold mb-2">
          Train Like Your Life Depends On It.
        </p>
        <p className="text-sm text-white/30 uppercase tracking-[0.3em] mb-12">
          Power &middot; Performance &middot; Purpose
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/signup">
            <button className="inline-flex items-center justify-center font-bold text-white bg-gradient-to-r from-amber to-ember rounded-xl px-8 py-4 text-base shadow-[0_2px_12px_rgba(255,165,0,0.35)] hover:shadow-[0_4px_20px_rgba(255,165,0,0.5)] transition-all active:scale-[0.98]">
              Start Training
            </button>
          </a>
          <a href="/pricing">
            <button className="inline-flex items-center justify-center font-bold text-amber border-2 border-amber bg-transparent rounded-xl px-8 py-4 text-base hover:bg-amber hover:text-charcoal transition-all active:scale-[0.98]">
              View Plans
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}

// Authenticated layout with sidebar + mobile nav
function AuthenticatedLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)
  const initialized = useAuthStore((s) => s.initialized)

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!initialized) return <Spinner className="min-h-screen" />

  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />

        {/* Onboarding (authenticated, no sub required) */}
        <Route path="/onboarding" element={
          <ProtectedRoute><OnboardingPage /></ProtectedRoute>
        } />

        {/* Authenticated + subscribed routes */}
        <Route element={
          <ProtectedRoute>
            <SubscriptionGate>
              <AuthenticatedLayout />
            </SubscriptionGate>
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/:id" element={<ProgramDetailPage />} />
          <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/workout-log" element={<WorkoutLogPage />} />
          <Route path="/workout-history" element={<WorkoutHistoryPage />} />
          <Route path="/habits" element={<HabitTrackerPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/transformations" element={<TransformationPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/locker-room" element={<LockerRoomPage />} />
          <Route path="/check-in" element={<CheckInPage />} />
          <Route path="/check-in/history" element={<CheckInHistoryPage />} />
          <Route path="/live-sessions" element={<LiveSessionsPage />} />
          <Route path="/live-sessions/:id" element={<LiveCallPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/:id" element={<ProductDetailPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/exclusive" element={<ExclusiveContentPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/subscription" element={<ManageBillingPage />} />
          <Route path="/account/settings" element={<SettingsPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="programs" element={<AdminProgramsPage />} />
          <Route path="workouts" element={<AdminWorkoutsPage />} />
          <Route path="exercises" element={<AdminExercisesPage />} />
          <Route path="members" element={<AdminMembersPage />} />
          <Route path="check-ins" element={<AdminCheckInsPage />} />
          <Route path="live-sessions" element={<AdminLiveSessionsPage />} />
          <Route path="locker-room" element={<AdminLockerRoomPage />} />
          <Route path="store" element={<AdminStorePage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="challenges" element={<AdminChallengesPage />} />
          <Route path="broadcast" element={<AdminBroadcastPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
