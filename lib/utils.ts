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

// Neon-dark urgency colours
export function urgencyColor(days: number): string {
  if (days < 0)  return 'text-slate-500';
  if (days <= 7)  return 'text-pink-400';
  if (days <= 30) return 'text-amber-400';
  return 'text-emerald-400';
}

export function urgencyBg(days: number): string {
  if (days < 0)   return 'bg-slate-800/50 border-slate-700';
  if (days <= 7)  return 'bg-pink-500/10 border-pink-500/25';
  if (days <= 30) return 'bg-amber-500/10 border-amber-500/25';
  return 'bg-emerald-500/10 border-emerald-500/25';
}

// Neon category tokens
export const CATEGORY_META: Record<
  PostCategory,
  { label: string; color: string; bg: string; border: string }
> = {
  tax:     { label: 'Tax',     color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/25' },
  work:    { label: 'Work',    color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    border: 'border-cyan-400/25' },
  social:  { label: 'Social',  color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/25' },
  housing: { label: 'Housing', color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/25' },
  visa:    { label: 'Visa',    color: 'text-pink-400',    bg: 'bg-pink-400/10',    border: 'border-pink-400/25' },
  general: { label: 'General', color: 'text-slate-400',   bg: 'bg-slate-400/10',   border: 'border-slate-400/25' },
};

export function getAvatarUrl(username: string, avatarUrl?: string | null): string {
  if (avatarUrl) return avatarUrl;
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(username)}&backgroundColor=7c3aed&textColor=ffffff`;
}

export function clampText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}
