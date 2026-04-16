import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';
import type { PostCategory } from '@/types/database';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(dateString: string): string {
  return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
}

export function daysUntil(dateString: string): number {
  return differenceInDays(parseISO(dateString), new Date());
}

export function urgencyColor(days: number): string {
  if (days < 0) return 'text-slate-400';
  if (days <= 7) return 'text-red-600';
  if (days <= 30) return 'text-amber-600';
  return 'text-emerald-600';
}

export function urgencyBg(days: number): string {
  if (days < 0) return 'bg-slate-100 border-slate-200';
  if (days <= 7) return 'bg-red-50 border-red-200';
  if (days <= 30) return 'bg-amber-50 border-amber-200';
  return 'bg-emerald-50 border-emerald-200';
}

export const CATEGORY_META: Record<
  PostCategory,
  { label: string; color: string; bg: string }
> = {
  tax:     { label: 'Tax',     color: 'text-amber-700',   bg: 'bg-amber-100' },
  work:    { label: 'Work',    color: 'text-blue-700',    bg: 'bg-blue-100' },
  social:  { label: 'Social',  color: 'text-emerald-700', bg: 'bg-emerald-100' },
  housing: { label: 'Housing', color: 'text-purple-700',  bg: 'bg-purple-100' },
  visa:    { label: 'Visa',    color: 'text-indigo-700',  bg: 'bg-indigo-100' },
  general: { label: 'General', color: 'text-slate-700',   bg: 'bg-slate-100' },
};

export function getAvatarUrl(username: string, avatarUrl?: string | null): string {
  if (avatarUrl) return avatarUrl;
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=6366f1&textColor=ffffff`;
}

export function clampText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}
