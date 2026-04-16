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
      {/* Category filter tabs */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {CATEGORIES.map(({ value, label }) => {
          const isActive = activeCategory === value;
          const meta = value !== 'all' ? CATEGORY_META[value] : null;
          return (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                isActive
                  ? meta
                    ? cn(meta.bg, meta.color)
                    : 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Post list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <p className="text-slate-500 text-sm">No posts in this category yet.</p>
          <p className="text-xs text-slate-400">Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </div>
      )}
    </div>
  );
}
