import { NavLink, Navigate, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import {
  UsersIcon,
  BookOpenIcon,
  BoltIcon,
  VideoCameraIcon,
  InboxIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  MegaphoneIcon,
  CalendarIcon,
  FireIcon,
  Squares2X2Icon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/store/authStore'
import Spinner from '@/components/ui/Spinner'

const ADMIN_NAV = [
  { to: '/admin', icon: Squares2X2Icon, label: 'Dashboard', end: true },
  { to: '/admin/programs', icon: BookOpenIcon, label: 'Programs' },
  { to: '/admin/workouts', icon: VideoCameraIcon, label: 'Workouts' },
  { to: '/admin/exercises', icon: BoltIcon, label: 'Exercises' },
  { to: '/admin/members', icon: UsersIcon, label: 'Members' },
  { to: '/admin/check-ins', icon: ClipboardDocumentListIcon, label: 'Check-Ins' },
  { to: '/admin/live-sessions', icon: VideoCameraIcon, label: 'Live Sessions' },
  { to: '/admin/locker-room', icon: LockClosedIcon, label: 'Locker Room' },
  { to: '/admin/store', icon: ShoppingBagIcon, label: 'Store' },
  { to: '/admin/orders', icon: InboxIcon, label: 'Orders' },
  { to: '/admin/events', icon: CalendarIcon, label: 'Events' },
  { to: '/admin/challenges', icon: FireIcon, label: 'Challenges' },
  { to: '/admin/broadcast', icon: MegaphoneIcon, label: 'Broadcast' },
]

export default function AdminLayout() {
  const { profile, initialized } = useAuthStore()

  if (!initialized) return <Spinner className="min-h-screen" />
  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-graphite border-r border-smoke overflow-y-auto sticky top-16 h-[calc(100vh-64px)]">
        <div className="p-4 border-b border-smoke">
          <p className="text-xs font-bold text-amber uppercase tracking-wider">Admin Panel</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  isActive
                    ? 'bg-amber/10 text-amber'
                    : 'text-white/50 hover:text-white hover:bg-smoke/40'
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
