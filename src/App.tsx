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

// Real auth pages
import LoginPage from '@/pages/Auth/LoginPage'
import SignupPage from '@/pages/Auth/SignupPage'
import PasswordResetPage from '@/pages/Auth/PasswordResetPage'
import AuthCallbackPage from '@/pages/Auth/AuthCallbackPage'
import OnboardingPage from '@/pages/Auth/OnboardingPage'

// Real account pages
import RealProfilePage from '@/pages/Account/ProfilePage'
import RealManageBillingPage from '@/pages/Account/ManageBillingPage'

// Real pricing pages
import RealPricingPage from '@/pages/Pricing/PricingPage'
import RealSubscriptionSuccessPage from '@/pages/Pricing/SubscriptionSuccessPage'

// Real training pages
import RealDashboardPage from '@/pages/Dashboard/DashboardPage'
import RealProgramsPage from '@/pages/Training/ProgramsPage'
import RealProgramDetailPage from '@/pages/Training/ProgramDetailPage'
import RealWorkoutDetailPage from '@/pages/Training/WorkoutDetailPage'
import RealExercisesPage from '@/pages/Training/ExercisesPage'
import RealExerciseDetailPage from '@/pages/Training/ExerciseDetailPage'

// Placeholder pages (will be replaced phase by phase)
import {
  ProgressPage, WorkoutLogPage,
  WorkoutHistoryPage, HabitTrackerPage, CommunityPage, TransformationPage,
  LeaderboardPage, LockerRoomPage, CheckInPage, CheckInHistoryPage,
  LiveSessionsPage, LiveCallPage, MessagesPage, ChallengesPage,
  ChallengeDetailPage, StorePage, ProductDetailPage, OrderHistoryPage,
  EventsPage, EventDetailPage, ExclusiveContentPage,
  SettingsPage,
  AdminDashboardPage, AdminProgramsPage, AdminWorkoutsPage, AdminExercisesPage,
  AdminMembersPage, AdminCheckInsPage, AdminLiveSessionsPage, AdminLockerRoomPage,
  AdminStorePage, AdminOrdersPage, AdminEventsPage, AdminChallengesPage,
  AdminBroadcastPage,
} from '@/pages/placeholder'

// Landing page
function LandingPage() {
  const user = useAuthStore((s) => s.user)
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-[calc(100vh-64px)] bg-charcoal">
      {/* Hero section */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
          <span className="text-amber text-glow-amber">SOS</span>{' '}
          <span className="text-white">TRAIN</span>
        </h1>
        <p className="text-xl sm:text-2xl text-white/60 font-semibold mb-2">
          Train Like Your Life Depends On It.
        </p>
        <p className="text-sm text-white/30 uppercase tracking-[0.3em] mb-12">
          Power &middot; Performance &middot; Purpose
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/signup">
            <button className="inline-flex items-center justify-center font-bold text-white bg-gradient-to-r from-amber to-ember rounded-xl px-8 py-4 text-base shadow-[0_2px_12px_rgba(255,165,0,0.35)] hover:shadow-[0_4px_20px_rgba(255,165,0,0.5)] transition-all active:scale-[0.98] cursor-pointer">
              Start Training
            </button>
          </a>
          <a href="/pricing">
            <button className="inline-flex items-center justify-center font-bold text-amber border-2 border-amber bg-transparent rounded-xl px-8 py-4 text-base hover:bg-amber hover:text-charcoal transition-all active:scale-[0.98] cursor-pointer">
              View Plans
            </button>
          </a>
        </div>
      </div>

      {/* Features section */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: 'Elite Programs', desc: 'Coach-designed training programs built for results, not reps.', icon: '🏋️' },
            { title: 'Live Coaching', desc: 'Join live group sessions or book 1-on-1 calls with your coach.', icon: '📹' },
            { title: 'Community', desc: 'Train alongside a community that pushes you to be better every day.', icon: '🔥' },
          ].map((f) => (
            <div key={f.title} className="bg-graphite border border-smoke rounded-2xl p-6 text-center">
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-smoke py-8 text-center">
        <p className="text-xs text-white/20">
          <span className="text-amber font-bold">SOS</span> TRAIN &middot; Built for Champions
        </p>
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
        <Route path="/pricing" element={<RealPricingPage />} />
        <Route path="/subscription/success" element={<RealSubscriptionSuccessPage />} />

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
          <Route path="/dashboard" element={<RealDashboardPage />} />
          <Route path="/programs" element={<RealProgramsPage />} />
          <Route path="/programs/:id" element={<RealProgramDetailPage />} />
          <Route path="/workouts/:id" element={<RealWorkoutDetailPage />} />
          <Route path="/exercises" element={<RealExercisesPage />} />
          <Route path="/exercises/:id" element={<RealExerciseDetailPage />} />
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
          <Route path="/account" element={<RealProfilePage />} />
          <Route path="/account/subscription" element={<RealManageBillingPage />} />
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
