import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/store/uiStore'
import type { Program } from '@/types'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'

export default function AdminProgramsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Program | null>(null)
  const [form, setForm] = useState({
    title: '', description: '', level: 'beginner' as string, duration_weeks: '',
    tier_required: 'member' as string, thumbnail_url: '',
  })

  const { data: programs, isLoading } = useQuery({
    queryKey: ['admin-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Program[]
    },
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description,
        level: form.level,
        duration_weeks: parseInt(form.duration_weeks) || null,
        tier_required: form.tier_required,
        thumbnail_url: form.thumbnail_url || null,
      }

      if (editing) {
        const { error } = await supabase.from('programs').update(payload).eq('id', editing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('programs').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] })
      toast.success(editing ? 'Program updated' : 'Program created')
      closeModal()
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from('programs').update({ is_published: published }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] })
      toast.success('Program updated')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('programs').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programs'] })
      toast.success('Program deleted')
    },
  })

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', description: '', level: 'beginner', duration_weeks: '', tier_required: 'member', thumbnail_url: '' })
    setShowModal(true)
  }

  const openEdit = (p: Program) => {
    setEditing(p)
    setForm({
      title: p.title,
      description: p.description || '',
      level: p.level,
      duration_weeks: String(p.duration_weeks || ''),
      tier_required: p.tier_required,
      thumbnail_url: p.thumbnail_url || '',
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
  }

  if (isLoading) return <Spinner className="min-h-[60vh]" />

  return (
    <PageWrapper title="Manage Programs" subtitle={`${programs?.length || 0} programs`}>
      <div className="flex justify-end mb-6">
        <Button onClick={openCreate} size="sm">Add Program</Button>
      </div>

      {!programs?.length ? (
        <Card className="text-center !py-12">
          <p className="text-white/40">No programs yet. Create your first one.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {programs.map((p) => (
            <Card key={p.id} className="!p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-sm truncate">{p.title}</h3>
                    <Badge variant={p.is_published ? 'success' : 'info'}>
                      {p.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge variant={p.tier_required === 'premium' ? 'premium' : 'amber'}>
                      {p.tier_required}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/30 truncate">{p.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublish.mutate({ id: p.id, published: !p.is_published })}
                  >
                    {p.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(p.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={showModal} onClose={closeModal} title={editing ? 'Edit Program' : 'New Program'}>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Description</label>
            <textarea
              className="w-full rounded-xl bg-graphite border border-smoke px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber min-h-[100px] resize-y"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">Level</label>
              <select
                className="w-full rounded-xl bg-graphite border border-smoke px-4 py-3 text-white text-sm"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <Input
              label="Duration (weeks)"
              type="number"
              value={form.duration_weeks}
              onChange={(e) => setForm({ ...form, duration_weeks: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">Tier Required</label>
            <select
              className="w-full rounded-xl bg-graphite border border-smoke px-4 py-3 text-white text-sm"
              value={form.tier_required}
              onChange={(e) => setForm({ ...form, tier_required: e.target.value })}
            >
              <option value="member">Member</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <Input
            label="Thumbnail URL"
            value={form.thumbnail_url}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
            placeholder="https://..."
          />
          <Button
            className="w-full"
            onClick={() => saveMutation.mutate()}
            loading={saveMutation.isPending}
            disabled={!form.title.trim()}
          >
            {editing ? 'Update Program' : 'Create Program'}
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  )
}
