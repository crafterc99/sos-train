import { Link } from 'react-router-dom'
import type { Exercise } from '@/types'
import Badge from '@/components/ui/Badge'
import { getThumbnailUrl } from '@/lib/mux'

interface ExerciseCardProps {
  exercise: Exercise
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const thumbnail = exercise.thumbnail_url || (exercise.mux_playback_id
    ? getThumbnailUrl(exercise.mux_playback_id, { width: 300 })
    : null)

  return (
    <Link
      to={`/exercises/${exercise.id}`}
      className="bg-graphite border border-smoke rounded-xl overflow-hidden hover:border-amber/30 transition-all group"
    >
      <div className="aspect-square bg-smoke overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={exercise.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-black text-white/10">SOS</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-bold text-sm text-white group-hover:text-amber transition-colors truncate">
          {exercise.name}
        </h4>
        <div className="flex flex-wrap gap-1 mt-2">
          {exercise.muscle_groups?.slice(0, 2).map((mg) => (
            <Badge key={mg} variant="info">{mg}</Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}
