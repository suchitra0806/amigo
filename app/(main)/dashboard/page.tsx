import type { Metadata } from 'next';
import Link from 'next/link';
import { format, startOfWeek } from 'date-fns';
import { createClient } from '@/lib/supabase/server';
import {
  GraduationCap, ShieldCheck, Clock, CalendarDays,
  Receipt, ClipboardList, BookOpen, MessageCircle,
  Bell, ChevronRight, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Dashboard — Amigo' };

export const revalidate = 0;

const QUICK_ACTIONS = [
  {
    href: '/taxes',
    icon: Receipt,
    label: 'Tax Hub',
    desc: 'Deadlines & filing guides',
    iconBg: 'bg-neutral-100',
    iconColor: 'text-neutral-700',
  },
  {
    href: '/work-log',
    icon: ClipboardList,
    label: 'Work Log',
    desc: 'Track your weekly hours',
    iconBg: 'bg-neutral-900',
    iconColor: 'text-white',
  },
  {
    href: '/resources',
    icon: BookOpen,
    label: 'Resources',
    desc: 'Visa, CPT & OPT guides',
    iconBg: 'bg-neutral-100',
    iconColor: 'text-neutral-700',
  },
];

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-900 shadow-chibi">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-lg font-black text-neutral-900">Sign in to access your portal</h2>
        <p className="mt-1 text-sm text-neutral-500 font-medium">
          Your personalized F-1 student dashboard is waiting.
        </p>
        <Link href="/auth/login" className="btn-primary mt-6 inline-flex">
          Sign In
        </Link>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const thisMonday = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const { data: weekLogs } = await supabase
    .from('work_logs')
    .select('hours_worked, work_type')
    .eq('user_id', user.id)
    .eq('week_start', thisMonday);

  const onCampusHours = (weekLogs ?? [])
    .filter((l) => l.work_type === 'on-campus')
    .reduce((sum, l) => sum + Number(l.hours_worked), 0);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const isProfileComplete = !!(profile?.university && profile?.graduation_year);

  const hoursColor: 'urgent' | 'warn' | 'ok' =
    onCampusHours > 20 ? 'urgent' : onCampusHours > 15 ? 'warn' : 'ok';

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900">
          {greeting},{' '}
          <span className="neon-text">{firstName}</span>{' '}
          <span className="text-2xl">👋</span>
        </h1>
        <p className="mt-0.5 text-sm text-neutral-500 font-semibold">
          {profile?.university ? `${profile.university} · ` : ''}
          {profile?.visa_status ?? 'F-1'} Student Portal
        </p>
      </div>

      {/* Profile completion banner */}
      {!isProfileComplete && (
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-3 transition-all hover:border-neutral-900 hover:bg-neutral-100"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-neutral-500" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-neutral-800">Complete your profile</p>
            <p className="text-xs text-neutral-500 font-medium">
              Add your university and program details
            </p>
          </div>
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-neutral-400" />
        </Link>
      )}

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatusCard
          icon={ShieldCheck}
          label="Visa Status"
          value={profile?.visa_status ?? 'F-1'}
          variant="default"
        />
        <StatusCard
          icon={Clock}
          label="This Week"
          value={`${onCampusHours.toFixed(1)} / 20 hrs`}
          variant={hoursColor === 'urgent' ? 'inverted' : 'default'}
          sub={onCampusHours > 20 ? 'Over limit!' : 'on-campus'}
        />
        <StatusCard
          icon={CalendarDays}
          label="Grad Year"
          value={profile?.graduation_year ? String(profile.graduation_year) : '—'}
          variant="muted"
        />
      </div>

      {/* DSO Announcements */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Bell className="h-4 w-4 text-neutral-400" />
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500">
            DSO Announcements
          </h2>
          {profile?.university && (
            <span className="ml-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500">
              {profile.university}
            </span>
          )}
        </div>
        <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center">
          <Bell className="mx-auto mb-2 h-6 w-6 text-neutral-300" />
          <p className="text-sm font-bold text-neutral-500">No announcements yet</p>
          <p className="mt-1 text-xs text-neutral-400 font-medium">
            {profile?.university
              ? `${profile.university} hasn't posted any updates yet.`
              : 'Once your university joins Amigo, DSO updates will appear here.'}
          </p>
        </div>
      </section>

      {/* Quick access */}
      <section>
        <div className="mb-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-500">
            Quick Access
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, iconBg, iconColor }) => (
            <Link
              key={href}
              href={href}
              className="card group flex items-start gap-3 p-4 hover:border-neutral-300 hover:shadow-chibi transition-all hover:-translate-y-px"
            >
              <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl', iconBg)}>
                <Icon className={cn('h-4 w-4', iconColor)} />
              </div>
              <div>
                <p className="text-sm font-black text-neutral-800 group-hover:text-black transition-colors">
                  {label}
                </p>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}

          {/* AI assistant hint */}
          <div className="card flex items-start gap-3 p-4 opacity-40 cursor-default select-none border-dashed">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-100">
              <MessageCircle className="h-4 w-4 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-black text-neutral-600">AI Assistant</p>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">Click the chat button ↘</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const VARIANT_MAP = {
  default:  {
    card:   'border-neutral-200 bg-white',
    iconBg: 'bg-neutral-100',
    icon:   'text-neutral-700',
    sub:    'text-neutral-500',
    value:  'text-neutral-900',
    label:  'text-neutral-400',
  },
  inverted: {
    card:   'border-neutral-900 bg-neutral-900',
    iconBg: 'bg-white/10',
    icon:   'text-white',
    sub:    'text-white/70',
    value:  'text-white',
    label:  'text-white/60',
  },
  muted: {
    card:   'border-neutral-200 bg-neutral-50',
    iconBg: 'bg-neutral-200',
    icon:   'text-neutral-400',
    sub:    'text-neutral-400',
    value:  'text-neutral-600',
    label:  'text-neutral-400',
  },
} as const;

function StatusCard({
  icon: Icon,
  label,
  value,
  variant = 'default',
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  variant?: keyof typeof VARIANT_MAP;
  sub?: string;
}) {
  const v = VARIANT_MAP[variant];
  return (
    <div className={cn('rounded-2xl border p-4', v.card)}>
      <div className={cn('mb-2 flex h-7 w-7 items-center justify-center rounded-xl', v.iconBg)}>
        <Icon className={cn('h-3.5 w-3.5', v.icon)} />
      </div>
      <p className={cn('text-[10px] font-black uppercase tracking-wider', v.label)}>{label}</p>
      <p className={cn('mt-0.5 truncate text-sm font-black', v.value)}>{value}</p>
      {sub && <p className={cn('mt-0.5 text-[10px] font-bold', v.sub)}>{sub}</p>}
    </div>
  );
}
