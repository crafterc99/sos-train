import { usePrograms } from '@/hooks/usePrograms'
import PageWrapper from '@/components/layout/PageWrapper'
import ProgramCard from '@/components/training/ProgramCard'
import Spinner from '@/components/ui/Spinner'

export default function ProgramsPage() {
  const { data: programs, isLoading } = usePrograms()

  return (
    <PageWrapper title="Programs" subtitle="Browse training programs">
      {isLoading ? (
        <Spinner className="py-20" />
      ) : !programs?.length ? (
        <div className="bg-graphite border border-smoke rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏋️</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Programs Yet</h3>
          <p className="text-sm text-white/40">Programs will appear here once the coach publishes them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
