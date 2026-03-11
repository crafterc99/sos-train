import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/store/uiStore'
import type { Exercise } from '@/types'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'

export default function AdminExercisesPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Exercise | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', difficulty: 'moderate',
    muscle_groups: '', equipment: '', mux_playback_id: '',
    instructions: '',
  })

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['admin-exercises'],
    queryFn: async () => {
      const { data, error } = await supabase.from('exercises').select('*').order('name')
      if (error) throw error
      return data as Exercise[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description || null,
        difficulty: form.difficulty,
        muscle_groups: form.muscle_groups.split(',').map((s) => s.trim()).filter(Boolean),
        equipment: form.equipment.split(',').map((s) => s.trim()).filter(Boolean),
        instructions: form.instructions.split('\n').filter(Boolean),
        mux_playback_id: form.mux_playback_id || null,
      }
      if (editing) {
        const { error } = await supabase.from('exercises').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('exercises').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exercises'] })
      toast.success(editing ? 'Exercise updated' : 'Exercise created')
      setShowModal(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('exercises').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exercises'] })
      toast.success('Exercise deleted')
    },
  })

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', difficulty: 'moderate', muscle_groups: '', equipment: '', mux_playback_id: '', instructions: '' })
    setShowModal(true)
  }

  const openEdit = (ex: Exercise) => {
    setEditing(ex)
    setForm({
      name: ex.name,
      description: ex.description || '',
      difficulty: ex.difficulty,
      muscle_groups: ex.muscle_groups?.join(', ') || '',
      equipment: ex.equipment?.join(', ') || '',
      mux_playback_id: ex.mux_playback_id || '',
      instructions: ex.instructions?.join('\n') || '',
    })
    setShowModal(true)
  }

  if (isLoading) return <Spinner className="min-h-[60vh]" />

  return (
    <PageWrapper title="Manage Exercises" subtitle={`${exercises?.length || 0} exercises`}>
      <div className="flex justify-end mb-6">
        <Button onClick={openCreate} size="sm">Add Exercise</Button>
      </div>

      {!exercises?.length ? (
        <Card className="text-center !py-12">
          <p className="text-white/40">No exercises yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {exercises.map((ex) => (
            <Card key={ex.id} className="!p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm truncate">{ex.name}</h3>
                    {ex.mux_playback_id && <Badge variant="amber">Video</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ex.muscle_groups?.map((mg) => (
                      <Badge key={mg} variant="info">{mg}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(ex)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(ex.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditing(null) }} title={editing ? 'Edit Exercise' : 'New Exercise'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Description</label>
            <textarea className="w-full rounded-xl bg-graphite border border-smoke px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber/50 min-h-[80px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Difficulty</label>
            <select className="w-full rounded-xl bg-graphite border border-smoke px-4 py-3 text-white text-sm" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <Input label="Muscle Groups" value={form.muscle_groups} onChange={(e) => setForm({ ...form, muscle_groups: e.target.value })} placeholder="chest, shoulders, triceps" />
          <Input label="Equipment" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} placeholder="barbell, bench, dumbbells" />
          <Input label="Mux Playback ID" value={form.mux_playback_id} onChange={(e) => setForm({ ...form, mux_playback_id: e.target.value })} placeholder="e.g. DS00Spx1CV..." />
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Coaching Cues (one per line)</label>
            <textarea className="w-full rounded-xl bg-graphite border border-smoke px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber/50 min-h-[100px] resize-y" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} placeholder="Keep elbows tucked&#10;Drive through heels&#10;Squeeze at the top" />
          </div>
          <Button className="w-full" onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} disabled={!form.name.trim()}>
            {editing ? 'Update Exercise' : 'Create Exercise'}
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  )
}
