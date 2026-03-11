import PageWrapper from '@/components/layout/PageWrapper'

export function createPlaceholder(title: string, subtitle?: string) {
  return function PlaceholderPage() {
    return (
      <PageWrapper title={title} subtitle={subtitle}>
        <div className="bg-graphite border border-smoke rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-amber font-black">S</span>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
          <p className="text-sm text-white/40">This module is coming soon.</p>
        </div>
      </PageWrapper>
    )
  }
}

// Pre-built placeholders for routing
export const DashboardPage = createPlaceholder('Dashboard', 'Your training overview')
export const ProgramsPage = createPlaceholder('Programs', 'Browse training programs')
export const ProgramDetailPage = createPlaceholder('Program Details')
export const WorkoutDetailPage = createPlaceholder('Workout')
export const ExercisesPage = createPlaceholder('Exercise Library', 'Browse exercises')
export const ExerciseDetailPage = createPlaceholder('Exercise Details')
export const ProgressPage = createPlaceholder('Progress', 'Track your journey')
export const WorkoutLogPage = createPlaceholder('Workout Log')
export const WorkoutHistoryPage = createPlaceholder('Workout History')
export const HabitTrackerPage = createPlaceholder('Habit Tracker')
export const CommunityPage = createPlaceholder('Community', 'Connect with other members')
export const TransformationPage = createPlaceholder('Transformations')
export const LeaderboardPage = createPlaceholder('Leaderboard', 'See who is on top')
export const LockerRoomPage = createPlaceholder('Locker Room', "Coach's corner")
export const CheckInPage = createPlaceholder('Weekly Check-In')
export const CheckInHistoryPage = createPlaceholder('Check-In History')
export const LiveSessionsPage = createPlaceholder('Live Sessions')
export const LiveCallPage = createPlaceholder('Live Call')
export const MessagesPage = createPlaceholder('Messages', 'Direct messaging')
export const ChallengesPage = createPlaceholder('Challenges', 'Compete and win')
export const ChallengeDetailPage = createPlaceholder('Challenge Details')
export const StorePage = createPlaceholder('Store', 'SOS Train merchandise')
export const ProductDetailPage = createPlaceholder('Product Details')
export const OrderHistoryPage = createPlaceholder('Order History')
export const EventsPage = createPlaceholder('Events', 'Upcoming events')
export const EventDetailPage = createPlaceholder('Event Details')
export const ExclusiveContentPage = createPlaceholder('Exclusive Content')
export const ProfilePage = createPlaceholder('Profile', 'Manage your account')
export const ManageBillingPage = createPlaceholder('Manage Subscription')
export const SettingsPage = createPlaceholder('Settings')
export const PricingPage = createPlaceholder('Pricing', 'Choose your plan')
export const SubscriptionSuccessPage = createPlaceholder('Welcome!', 'Your subscription is active')

// Admin placeholders
export const AdminDashboardPage = createPlaceholder('Admin Dashboard')
export const AdminProgramsPage = createPlaceholder('Manage Programs')
export const AdminWorkoutsPage = createPlaceholder('Manage Workouts')
export const AdminExercisesPage = createPlaceholder('Manage Exercises')
export const AdminMembersPage = createPlaceholder('Manage Members')
export const AdminCheckInsPage = createPlaceholder('Review Check-Ins')
export const AdminLiveSessionsPage = createPlaceholder('Manage Live Sessions')
export const AdminLockerRoomPage = createPlaceholder('Manage Locker Room')
export const AdminStorePage = createPlaceholder('Manage Store')
export const AdminOrdersPage = createPlaceholder('Manage Orders')
export const AdminEventsPage = createPlaceholder('Manage Events')
export const AdminChallengesPage = createPlaceholder('Manage Challenges')
export const AdminBroadcastPage = createPlaceholder('Broadcast Messages')
