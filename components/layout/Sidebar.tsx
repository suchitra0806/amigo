'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Newspaper,
  Receipt,
  ClipboardList,
  BookOpen,
  Settings,
  GraduationCap,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/feed',     label: 'Community Feed',  icon: Newspaper },
  { href: '/taxes',    label: 'Tax Hub',          icon: Receipt },
  { href: '/work-log', label: 'Work Log',         icon: ClipboardList },
  { href: '/resources',label: 'Resources',        icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-3 py-4">
      {/* Brand */}
      <Link href="/feed" className="mb-6 flex items-center gap-2.5 px-3 py-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900">Amigo</span>
      </Link>

      {/* Primary navigation */}
      <nav className="flex-1 space-y-1">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigate
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'nav-link',
              pathname.startsWith(href) && 'nav-link-active'
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-4 space-y-1 border-t border-slate-100 pt-4">
        <Link href="/settings" className="nav-link">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <Link href="/auth/login" className="nav-link">
          <LogIn className="h-4 w-4" />
          Sign In / Sign Up
        </Link>
        <p className="mt-3 px-3 text-[11px] leading-snug text-slate-400">
          Built for F-1 students.
          <br />
          Not legal or financial advice.
        </p>
      </div>
    </div>
  );
}
