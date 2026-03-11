import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/store/uiStore'
import type { Workout, Program } from '@/types'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'

export default function AdminWorkoutsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Workout | null>(null)
  const [filterProgram, setFilterProgram] = useState<string>('')
  const [form, setForm] = useState({
    title: '', description: '', program_id: '', difficulty: 'moderate',
    duration_minutes: '', mux_playback_id: '', tier_required: 'member',
  })

  const { data: programs } = useQuery({
    queryKey: ['admin-programs-list'],
    queryFn: async () => {
      const { data } = await supabase.from('programs').select('id, title').order('title')
      return data as Pick<Program, 'id' | 'title'>[]
    },
  })

  const { data: workouts, isLoading } = useQuery({
    queryKey: ['admin-workouts', filterProgram],
    queryFn: async () => {
      let query = supabase.from('workouts').select('*').order('order_index')
      if (filterProgram) query = query.eq('program_id', filterProgram)
      const { data, error } = await query
      if (error) throw error
      return data as Workout[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description || null,
        program_id: form.program_id || null,
        difficulty: form.difficulty,
        duration_minutes: parseInt(form.duration_minutes) || null,
        mux_playback_id: form.mux_playback_id || null,
        tier_required: form.tier_required,
      }
      if (editing) {
        const { error } = await supabase.from('workouts').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('workouts').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workouts'] })
      toast.success(editing ? 'Workout updated' : 'Workout created')
      setShowModal(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from('workouts').update({ is_published: published }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-workouts'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workouts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workouts'] })
      toast.success('Workout deleted')
    },
  })

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', description: '', program_id: '', difficulty: 'moderate', duration_minutes: '', mux_playback_id: '', tier_required: 'member' })
    setShowModal(true)
  }

  const openEdit = (w: Workout) => {
    setEditing(w)
    setForm({
      title: w.title, description: w.description || '', program_id: w.program_id || '',
      difficulty: w.difficulty, duration_minutes: String(w.duration_minutes || ''),
      mux_playback_id: w.mux_playback_id || '', tier_required: w.tier_required,
    })
    setShowModal(true)
  }

  if (isLoading) return <Spinner className="min-h-[60vh]" />

  return (
    <PageWrapper title="Manage Workouts" subtitle={`${workouts?.length || 0} workouts`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <select
          className="rounded-xl bg-graphite border border-smoke px-4 py-2 text-white text-sm"
          value={filterProgram}
          onChange={(e) => setFilterProgram(e.target.value)}
        >
          <option value="">All Programs</option>
          {programs?.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
        <Button onClick={openCreate} size="sm">Add Workout</Button>
      </div>

      {!workouts?.length ? (
        <Card className="text-center !py-12">
          <p className="text-white/40">No workouts yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => (
            <Card key={w.id} className="!p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm truncate">{w.title}</h3>
                    <Badge variant={w.is_published ? 'success' : 'info'}>
                      {w.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    {w.duration_minutes && <span>{w.duration_minutes} min</span>}
                    <span>{w.difficulty}</span>
                    {w.mux_playback_id && <Badge variant="amber">Video</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => togglePublish.mutate({ id: w.id, published: !w.is_published })}>
                    {w.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(w)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(w.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditing(null) }} title={editing ? 'Edit Workout' : 'New Workout'}>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Description</label>
            <textarea className="w-full rounded-xl bg-graphite border border-smoke px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber/50 min-h-[80px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Program</label>
            <select className="w-full rounded-xl bg-graphite border border-smoke px-4 py-3 text-white text-sm" value={form.program_id} onChange={(e) => setForm({ ...form, program_id: e.target.value })}>
              <option value="">No Program</option>
              {programs?.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Difficulty</label>
              <select className="w-full rounded-xl bg-graphite border border-smoke px-4 py-3 text-white text-sm" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <Input label="Duration (min)" type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} />
          </div>
          <Input label="Mux Playback ID" value={form.mux_playback_id} onChange={(e) => setForm({ ...form, mux_playback_id: e.target.value })} placeholder="e.g. DS00Spx1CV..." />
          <Button className="w-full" onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} disabled={!form.title.trim()}>
            {editing ? 'Update Workout' : 'Create Workout'}
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  )
}
