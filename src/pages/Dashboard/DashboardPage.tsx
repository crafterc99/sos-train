import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { formatRelative } from '@/utils/formatDate'

export default function DashboardPage() {
  const profile = useAuthStore((s) => s.profile)

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', profile?.id],
    queryFn: async () => {
      if (!profile) return null

      // Workout count this week
      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      startOfWeek.setHours(0, 0, 0, 0)

      const { count: weeklyWorkouts } = await supabase
        .from('workout_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .gte('completed_at', startOfWeek.toISOString())

      // Total workouts
      const { count: totalWorkouts } = await supabase
        .from('workout_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)

      // Latest workout
      const { data: latestWorkout } = await supabase
        .from('workout_logs')
        .select('*, workout:workouts(title)')
        .eq('user_id', profile.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      // Active programs count
      const { count: programCount } = await supabase
        .from('programs')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      // Streak (consecutive days with workouts)
      const { data: recentLogs } = await supabase
        .from('workout_logs')
        .select('completed_at')
        .eq('user_id', profile.id)
        .order('completed_at', { ascending: false })
        .limit(30)

      let streak = 0
      if (recentLogs?.length) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        for (let i = 0; i < 30; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(checkDate.getDate() - i)
          const dateStr = checkDate.toISOString().split('T')[0]

          const hasLog = recentLogs.some((log) =>
            log.completed_at.startsWith(dateStr)
          )

          if (hasLog) streak++
          else if (i > 0) break
        }
      }

      return {
        weeklyWorkouts: weeklyWorkouts || 0,
        totalWorkouts: totalWorkouts || 0,
        latestWorkout,
        programCount: programCount || 0,
        streak,
      }
    },
    enabled: !!profile,
  })

  if (isLoading) return <Spinner className="min-h-[60vh]" />

  return (
    <PageWrapper>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome back, <span className="text-amber">{profile?.display_name || 'Champion'}</span>
        </h1>
        <p className="text-sm text-white/40 mt-1">Let's get after it today.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'This Week', value: stats?.weeklyWorkouts || 0, suffix: 'workouts' },
          { label: 'Streak', value: stats?.streak || 0, suffix: 'days', highlight: true },
          { label: 'Total', value: stats?.totalWorkouts || 0, suffix: 'workouts' },
          { label: 'Programs', value: stats?.programCount || 0, suffix: 'available' },
        ].map((stat) => (
          <Card key={stat.label} className="!p-4 text-center" glow={stat.highlight}>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-white/40 mt-1">{stat.suffix}</p>
            <p className="text-[10px] text-white/20 uppercase tracking-wider mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Latest workout */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">Last Workout</h3>
          <Link to="/workout-history" className="text-xs text-amber hover:text-blaze transition-colors">
            View All
          </Link>
        </div>
        {stats?.latestWorkout ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">
                {stats.latestWorkout.workout?.title || 'Workout'}
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                {formatRelative(stats.latestWorkout.completed_at)}
              </p>
            </div>
            <Badge variant="success">Completed</Badge>
          </div>
        ) : (
          <p className="text-sm text-white/30">No workouts completed yet. Start your first one!</p>
        )}
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/programs">
          <Card className="!p-5 hover:border-amber/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center">
                <span className="text-xl">🏋️</span>
              </div>
              <div>
                <p className="font-bold text-white group-hover:text-amber transition-colors">Browse Programs</p>
                <p className="text-xs text-white/40">Find your next challenge</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link to="/exercises">
          <Card className="!p-5 hover:border-amber/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center">
                <span className="text-xl">💪</span>
              </div>
              <div>
                <p className="font-bold text-white group-hover:text-amber transition-colors">Exercise Library</p>
                <p className="text-xs text-white/40">Learn proper form</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </PageWrapper>
  )
}
