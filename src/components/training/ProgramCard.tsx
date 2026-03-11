import { Link } from 'react-router-dom'
import type { Program } from '@/types'
import Badge from '@/components/ui/Badge'
import { getThumbnailUrl } from '@/lib/mux'

interface ProgramCardProps {
  program: Program
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const thumbnail = program.thumbnail_url || (program.workouts?.[0]?.mux_playback_id
    ? getThumbnailUrl(program.workouts[0].mux_playback_id, { width: 400 })
    : null)

  return (
    <Link
      to={`/programs/${program.id}`}
      className="block bg-graphite border border-smoke rounded-2xl overflow-hidden hover:border-amber/30 transition-all duration-200 group"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-smoke relative overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={program.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-black text-white/10">SOS</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant={program.tier_required === 'premium' ? 'premium' : 'amber'}>
            {program.tier_required === 'premium' ? 'Premium' : 'Member'}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-white text-sm mb-1 group-hover:text-amber transition-colors">
          {program.title}
        </h3>
        <p className="text-xs text-white/40 line-clamp-2 mb-3">{program.description}</p>
        <div className="flex items-center gap-3 text-xs text-white/30">
          {program.duration_weeks && <span>{program.duration_weeks} weeks</span>}
          {program.level && (
            <Badge variant="info">{program.level}</Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
