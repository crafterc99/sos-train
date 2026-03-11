import { useParams } from 'react-router-dom'
import { useExercise } from '@/hooks/usePrograms'
import PageWrapper from '@/components/layout/PageWrapper'
import VideoPlayer from '@/components/training/VideoPlayer'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: exercise, isLoading } = useExercise(id!)

  if (isLoading) return <Spinner className="min-h-[60vh]" />
  if (!exercise) return <PageWrapper title="Exercise Not Found"><p className="text-white/40">This exercise doesn't exist.</p></PageWrapper>

  return (
    <PageWrapper>
      {/* Video */}
      {exercise.mux_playback_id && (
        <VideoPlayer playbackId={exercise.mux_playback_id} className="mb-6" />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{exercise.name}</h1>
        <div className="flex flex-wrap gap-2 mb-3">
          {exercise.muscle_groups?.map((mg: string) => (
            <Badge key={mg} variant="amber">{mg}</Badge>
          ))}
          {exercise.equipment?.map((eq: string) => (
            <Badge key={eq} variant="info">{eq}</Badge>
          ))}
          {exercise.difficulty && <Badge variant="info">{exercise.difficulty}</Badge>}
        </div>
        {exercise.description && (
          <p className="text-sm text-white/50">{exercise.description}</p>
        )}
      </div>

      {/* Instructions / Coaching Cues */}
      {exercise.instructions?.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Coaching Cues</h2>
          <ol className="space-y-3">
            {exercise.instructions.map((instruction: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber/10 flex items-center justify-center shrink-0 text-xs font-bold text-amber">
                  {i + 1}
                </span>
                <span className="text-sm text-white/70">{instruction}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </PageWrapper>
  )
}
