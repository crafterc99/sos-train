import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import {
  HomeIcon,
  BookOpenIcon,
  BoltIcon,
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  LockClosedIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/store/authStore'

const NAV_ITEMS = [
  { to: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { to: '/programs', icon: BookOpenIcon, label: 'Programs' },
  { to: '/exercises', icon: BoltIcon, label: 'Exercises' },
  { to: '/progress', icon: ChartBarIcon, label: 'Progress' },
  { to: '/community', icon: UserGroupIcon, label: 'Community' },
  { to: '/leaderboard', icon: TrophyIcon, label: 'Leaderboard' },
  { to: '/locker-room', icon: LockClosedIcon, label: 'Locker Room' },
  { to: '/messages', icon: ChatBubbleLeftRightIcon, label: 'Messages' },
  { to: '/check-in', icon: CalendarDaysIcon, label: 'Check-In' },
  { to: '/account', icon: UserCircleIcon, label: 'Account' },
]

export default function Sidebar() {
  const profile = useAuthStore((s) => s.profile)

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-graphite border-r border-smoke h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
      {/* User info */}
      {profile && (
        <div className="p-4 border-b border-smoke">
          <p className="text-sm font-semibold text-white truncate">{profile.display_name || 'Member'}</p>
          <p className="text-xs text-white/40 truncate">{profile.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-amber/10 text-amber'
                  : 'text-white/50 hover:text-white hover:bg-smoke/40'
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-smoke">
        <p className="text-xs text-white/20 text-center">
          <span className="text-amber font-bold">SOS</span> TRAIN
        </p>
      </div>
    </aside>
  )
}
