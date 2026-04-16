'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import { cn, CATEGORY_META } from '@/lib/utils';
import type { PostWithAuthor, PostCategory } from '@/types/database';

const CATEGORIES: { value: PostCategory | 'all'; label: string }[] = [
  { value: 'all',     label: 'All' },
  { value: 'tax',     label: 'Tax' },
  { value: 'work',    label: 'Work' },
  { value: 'social',  label: 'Social' },
  { value: 'housing', label: 'Housing' },
  { value: 'visa',    label: 'Visa' },
  { value: 'general', label: 'General' },
];

interface PostListProps {
  posts: PostWithAuthor[];
  currentUserId?: string;
}

export default function PostList({ posts, currentUserId }: PostListProps) {
  const [activeCategory, setActiveCategory] = useState<PostCategory | 'all'>('all');

  const filtered =
    activeCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Category tabs */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {CATEGORIES.map(({ value, label }) => {
          const isActive = activeCategory === value;
          const meta = value !== 'all' ? CATEGORY_META[value] : null;

          return (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-all border',
                isActive
                  ? meta
                    ? cn(meta.color, meta.bg, meta.border, 'shadow-sm')
                    : 'bg-violet-500/15 text-violet-300 border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-300'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Posts */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-24 text-center">
          <div className="text-3xl mb-1">👾</div>
          <p className="text-sm text-slate-500">No posts here yet.</p>
          <p className="text-xs text-slate-600">Be the first to drop something!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  );
}
