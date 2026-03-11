import { useParams } from 'react-router-dom'
import { useWorkout, useMarkWorkoutComplete } from '@/hooks/usePrograms'
import { useToast } from '@/store/uiStore'
import PageWrapper from '@/components/layout/PageWrapper'
import VideoPlayer from '@/components/training/VideoPlayer'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { formatDuration } from '@/utils/formatNumber'

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: workout, isLoading } = useWorkout(id!)
  const markComplete = useMarkWorkoutComplete()
  const toast = useToast()

  const handleComplete = async () => {
    try {
      await markComplete.mutateAsync({ workoutId: id! })
      toast.success('Workout completed! Great work.')
    } catch {
      toast.error('Failed to mark workout as complete')
    }
  }

  if (isLoading) return <Spinner className="min-h-[60vh]" />
  if (!workout) return <PageWrapper title="Workout Not Found"><p className="text-white/40">This workout doesn't exist.</p></PageWrapper>

  return (
    <PageWrapper>
      {/* Video */}
      {workout.mux_playback_id && (
        <VideoPlayer playbackId={workout.mux_playback_id} className="mb-6" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{workout.title}</h1>
          <p className="text-sm text-white/50">{workout.description}</p>
          <div className="flex items-center gap-3 mt-2">
            {workout.duration_minutes && (
              <span className="text-xs text-white/30">{formatDuration(workout.duration_minutes)}</span>
            )}
            {workout.difficulty && <Badge variant="info">{workout.difficulty}</Badge>}
            {workout.equipment?.map((eq: string) => (
              <Badge key={eq} variant="info">{eq}</Badge>
            ))}
          </div>
        </div>
        <Button
          onClick={handleComplete}
          loading={markComplete.isPending}
          size="sm"
        >
          Mark Complete
        </Button>
      </div>

      {/* Exercise List */}
      {workout.exercises?.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-white mb-4">Exercises</h2>
          <div className="space-y-3">
            {workout.exercises.map((we: { id: string; order_index: number; sets: number | null; reps: string | null; rest_seconds: number | null; notes: string | null; exercise?: { name: string; muscle_groups?: string[] } }, i: number) => (
              <Card key={we.id} className="!p-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-amber">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-white">{we.exercise?.name || 'Exercise'}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                      {we.sets && <span>{we.sets} sets</span>}
                      {we.reps && <span>{we.reps} reps</span>}
                      {we.rest_seconds && <span>{we.rest_seconds}s rest</span>}
                    </div>
                    {we.notes && <p className="text-xs text-white/30 mt-1">{we.notes}</p>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </PageWrapper>
  )
}
