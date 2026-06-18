'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  ClipboardList,
  BookOpen,
  GraduationCap,
  Sparkles,
  UserCircle,
  CalendarClock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/taxes',       label: 'Tax Hub',    icon: Receipt },
  { href: '/work-log',    label: 'Work Log',   icon: ClipboardList },
  { href: '/opt-tracker', label: 'OPT Tracker', icon: CalendarClock },
  { href: '/resources',  label: 'Resources',  icon: BookOpen },
  { href: '/profile',    label: 'My Profile', icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-3 py-5">
      {/* Brand */}
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 shadow-chibi">
          <GraduationCap className="h-5 w-5 text-white" />
          <span className="absolute inset-0 rounded-2xl ring-2 ring-black/10 animate-pulse-slow" />
        </div>
        <div>
          <span className="neon-text text-lg font-black tracking-tight">Amigo</span>
          <p className="text-[10px] text-neutral-400 font-semibold leading-none mt-0.5">Student Portal</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <p className="mb-2 px-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
          Navigate
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn('nav-link', isActive && 'nav-link-active')}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
              {isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-neutral-100 pt-4">
        {/* Tagline */}
        <div className="mx-1 rounded-2xl bg-neutral-100 border border-neutral-200 px-3 py-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3 w-3 text-neutral-500" />
            <span className="text-[10px] font-black text-neutral-600 uppercase tracking-wider">
              Built for F-1s
            </span>
          </div>
          <p className="text-[10px] leading-snug text-neutral-400 font-medium">
            Not legal or financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
