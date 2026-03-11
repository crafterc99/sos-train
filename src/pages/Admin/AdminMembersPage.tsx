import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'
import PageWrapper from '@/components/layout/PageWrapper'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { formatShort } from '@/utils/formatDate'
import clsx from 'clsx'

type TierFilter = 'all' | 'none' | 'member' | 'premium'

export default function AdminMembersPage() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<TierFilter>('all')

  const { data: members, isLoading } = useQuery({
    queryKey: ['admin-members', search, tierFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (search) {
        query = query.or(`display_name.ilike.%${search}%,email.ilike.%${search}%`)
      }
      if (tierFilter !== 'all') {
        query = query.eq('subscription_tier', tierFilter)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Profile[]
    },
  })

  if (isLoading) return <Spinner className="min-h-[60vh]" />

  return (
    <PageWrapper title="Members" subtitle={`${members?.length || 0} members`}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'none', 'member', 'premium'] as TierFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={clsx(
                'px-3 py-2 rounded-lg text-xs font-semibold transition-all capitalize',
                tierFilter === t
                  ? 'bg-amber text-charcoal'
                  : 'bg-graphite text-white/50 border border-smoke'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {!members?.length ? (
        <Card className="text-center !py-12">
          <p className="text-white/40">No members found.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <Card key={m.id} className="!p-4">
              <div className="flex items-center gap-4">
                <Avatar src={m.avatar_url} name={m.display_name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-sm truncate">
                      {m.display_name || 'No name'}
                    </p>
                    {m.role === 'admin' && <Badge variant="premium">Admin</Badge>}
                    {m.subscription_tier !== 'none' && (
                      <Badge variant={m.subscription_tier === 'premium' ? 'premium' : 'amber'}>
                        {m.subscription_tier}
                      </Badge>
                    )}
                    {m.subscription_status && (
                      <Badge variant={m.subscription_status === 'active' ? 'success' : 'danger'}>
                        {m.subscription_status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-white/30 truncate">{m.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-white/20">Joined {formatShort(m.created_at)}</p>
                  {m.onboarding_completed ? (
                    <p className="text-[10px] text-turf">Onboarded</p>
                  ) : (
                    <p className="text-[10px] text-white/20">Not onboarded</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
