import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

const TABS = [
  { to: '/dashboard', icon: HomeIcon, label: 'Home' },
  { to: '/programs', icon: BookOpenIcon, label: 'Train' },
  { to: '/community', icon: UserGroupIcon, label: 'Community' },
  { to: '/progress', icon: ChartBarIcon, label: 'Progress' },
  { to: '/account', icon: UserCircleIcon, label: 'Account' },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-graphite border-t border-smoke pb-safe">
      <div className="flex items-center justify-around h-16">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-colors',
                isActive ? 'text-amber' : 'text-white/40'
              )
            }
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
