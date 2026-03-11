import { useState } from 'react'
import { useExercises } from '@/hooks/usePrograms'
import PageWrapper from '@/components/layout/PageWrapper'
import ExerciseCard from '@/components/training/ExerciseCard'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import clsx from 'clsx'

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Glutes', 'Full Body']

export default function ExercisesPage() {
  const [search, setSearch] = useState('')
  const [muscleGroup, setMuscleGroup] = useState<string>()
  const { data: exercises, isLoading } = useExercises({
    search: search || undefined,
    muscleGroup,
  })

  return (
    <PageWrapper title="Exercise Library" subtitle="Browse exercises with demo videos">
      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Muscle group filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {MUSCLE_GROUPS.map((mg) => (
          <button
            key={mg}
            onClick={() => setMuscleGroup(mg === 'All' ? undefined : mg.toLowerCase())}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
              (mg === 'All' && !muscleGroup) || muscleGroup === mg.toLowerCase()
                ? 'bg-amber text-charcoal'
                : 'bg-graphite text-white/50 border border-smoke hover:text-white'
            )}
          >
            {mg}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <Spinner className="py-20" />
      ) : !exercises?.length ? (
        <div className="bg-graphite border border-smoke rounded-2xl p-12 text-center">
          <h3 className="text-lg font-bold text-white mb-2">No Exercises Found</h3>
          <p className="text-sm text-white/40">
            {search ? 'Try a different search term.' : 'Exercises will appear here once added.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
