import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [members, programs, workouts, exercises] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'member'),
        supabase.from('programs').select('*', { count: 'exact', head: true }),
        supabase.from('workouts').select('*', { count: 'exact', head: true }),
        supabase.from('exercises').select('*', { count: 'exact', head: true }),
      ])
      return {
        members: members.count || 0,
        programs: programs.count || 0,
        workouts: workouts.count || 0,
        exercises: exercises.count || 0,
      }
    },
  })

  if (isLoading) return <Spinner className="min-h-[60vh]" />

  return (
    <PageWrapper title="Admin Dashboard" subtitle="Platform overview">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Members', value: stats?.members, color: 'text-amber' },
          { label: 'Programs', value: stats?.programs, color: 'text-turf' },
          { label: 'Workouts', value: stats?.workouts, color: 'text-blaze' },
          { label: 'Exercises', value: stats?.exercises, color: 'text-white' },
        ].map((stat) => (
          <Card key={stat.label} className="!p-5 text-center">
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">{stat.label}</p>
          </Card>
        ))}
      </div>
    </PageWrapper>
  )
}
