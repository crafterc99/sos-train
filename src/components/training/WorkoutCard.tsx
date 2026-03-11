import { Link } from 'react-router-dom'
import type { Workout } from '@/types'
import Badge from '@/components/ui/Badge'
import { getThumbnailUrl } from '@/lib/mux'
import { formatDuration } from '@/utils/formatNumber'

interface WorkoutCardProps {
  workout: Workout
  completed?: boolean
}

export default function WorkoutCard({ workout, completed }: WorkoutCardProps) {
  const thumbnail = workout.thumbnail_url || (workout.mux_playback_id
    ? getThumbnailUrl(workout.mux_playback_id, { width: 400 })
    : null)

  return (
    <Link
      to={`/workouts/${workout.id}`}
      className="flex gap-4 bg-graphite border border-smoke rounded-xl p-4 hover:border-amber/30 transition-all group"
    >
      {/* Thumbnail */}
      <div className="w-28 h-20 rounded-lg bg-smoke overflow-hidden shrink-0 relative">
        {thumbnail ? (
          <img src={thumbnail} alt={workout.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-lg font-black text-white/10">SOS</span>
          </div>
        )}
        {completed && (
          <div className="absolute inset-0 bg-turf/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-white group-hover:text-amber transition-colors truncate">
          {workout.title}
        </h4>
        <p className="text-xs text-white/40 line-clamp-1 mt-0.5">{workout.description}</p>
        <div className="flex items-center gap-2 mt-2">
          {workout.duration_minutes && (
            <span className="text-xs text-white/30">{formatDuration(workout.duration_minutes)}</span>
          )}
          {workout.difficulty && (
            <Badge variant="info">{workout.difficulty}</Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
