import { useParams } from 'react-router-dom'
import { useProgram } from '@/hooks/usePrograms'
import PageWrapper from '@/components/layout/PageWrapper'
import WorkoutCard from '@/components/training/WorkoutCard'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: program, isLoading } = useProgram(id!)

  if (isLoading) return <Spinner className="min-h-[60vh]" />
  if (!program) return <PageWrapper title="Program Not Found"><p className="text-white/40">This program doesn't exist.</p></PageWrapper>

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{program.title}</h1>
          {program.level && <Badge variant="info">{program.level}</Badge>}
          <Badge variant={program.tier_required === 'premium' ? 'premium' : 'amber'}>
            {program.tier_required}
          </Badge>
        </div>
        <p className="text-sm text-white/50 max-w-2xl">{program.description}</p>
        {program.duration_weeks && (
          <p className="text-xs text-white/30 mt-2">{program.duration_weeks} week program</p>
        )}
      </div>

      {/* Workouts */}
      <h2 className="text-lg font-bold text-white mb-4">Workouts</h2>
      {program.workouts?.length ? (
        <div className="space-y-3">
          {program.workouts.map((workout, i) => (
            <div key={workout.id} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-smoke flex items-center justify-center shrink-0 text-xs font-bold text-white/40">
                {i + 1}
              </div>
              <div className="flex-1">
                <WorkoutCard workout={workout} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/30">No workouts in this program yet.</p>
      )}
    </PageWrapper>
  )
}
