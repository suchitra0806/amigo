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
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/feed',      label: 'Community Feed', icon: Newspaper },
  { href: '/taxes',     label: 'Tax Hub',        icon: Receipt },
  { href: '/work-log',  label: 'Work Log',       icon: ClipboardList },
  { href: '/resources', label: 'Resources',      icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col px-3 py-5">
      {/* Brand */}
      <Link href="/feed" className="mb-8 flex items-center gap-3 px-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-neon-purple">
          <GraduationCap className="h-5 w-5 text-white" />
          {/* pulse ring */}
          <span className="absolute inset-0 rounded-xl ring-2 ring-violet-500/40 animate-pulse-slow" />
        </div>
        <div>
          <span className="neon-text text-lg font-bold tracking-tight">Amigo</span>
          <p className="text-[10px] text-slate-500 leading-none mt-0.5">F-1 Student Hub</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
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
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-slate-800 pt-4">
        <Link href="/settings" className="nav-link">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <Link href="/auth/login" className="nav-link">
          <LogIn className="h-4 w-4" />
          Sign In / Sign Up
        </Link>

        {/* Tagline */}
        <div className="mt-3 mx-2 rounded-lg bg-violet-500/8 border border-violet-500/15 px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="h-3 w-3 text-violet-400" />
            <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">Built for F-1s</span>
          </div>
          <p className="text-[10px] leading-snug text-slate-500">
            Not legal or financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
