import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, SmilePlus, Pill, BarChart3, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Log Mood', href: '/log-mood', icon: SmilePlus },
  { name: 'Medication', href: '/medications', icon: Pill },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-100">
        <span className="text-xl font-bold text-indigo-600">MoodSync</span>
      </div>
      <nav className="flex flex-1 flex-col px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-indigo-600',
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600',
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
