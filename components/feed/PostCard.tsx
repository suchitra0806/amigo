'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { cn, timeAgo, getAvatarUrl, clampText, CATEGORY_META } from '@/lib/utils';
import type { PostWithAuthor } from '@/types/database';

interface PostCardProps {
  post: PostWithAuthor;
  currentUserId?: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [upvoteCount, setUpvoteCount] = useState(post.upvote_count);
  const [userVoted, setUserVoted] = useState(post.user_voted ?? false);
  const [voting, setVoting] = useState(false);

  const meta = CATEGORY_META[post.category];
  const authorUsername = post.profiles?.username ?? 'unknown';
  const avatarUrl = getAvatarUrl(authorUsername, post.profiles?.avatar_url);

  async function handleUpvote() {
    if (!currentUserId) {
      // TODO: open auth modal
      return;
    }
    if (voting) return;

    // Optimistic update
    const wasVoted = userVoted;
    setUserVoted(!wasVoted);
    setUpvoteCount((c) => (wasVoted ? c - 1 : c + 1));
    setVoting(true);

    try {
      const res = await fetch('/api/posts/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      });

      if (!res.ok) throw new Error('Vote failed');

      const data = await res.json();
      setUpvoteCount(data.upvote_count);
      setUserVoted(data.user_voted);
    } catch {
      // Revert optimistic update on failure
      setUserVoted(wasVoted);
      setUpvoteCount((c) => (wasVoted ? c + 1 : c - 1));
    } finally {
      setVoting(false);
    }
  }

  return (
    <article className="card p-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Image
            src={avatarUrl}
            alt={authorUsername}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <span className="text-sm font-medium text-slate-800">@{authorUsername}</span>
            <span className="ml-2 text-xs text-slate-400">{timeAgo(post.created_at)}</span>
          </div>
        </div>
        <span className={cn('badge', meta.bg, meta.color)}>{meta.label}</span>
      </div>

      {/* Content */}
      <h3 className="mb-1.5 text-base font-semibold text-slate-900 leading-snug">
        {post.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600">
        {clampText(post.body, 220)}
      </p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4">
        {/* Upvote */}
        <button
          onClick={handleUpvote}
          disabled={voting}
          aria-label={userVoted ? 'Remove upvote' : 'Upvote'}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
            userVoted
              ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
            !currentUserId && 'cursor-default opacity-60'
          )}
        >
          <ArrowUp
            className={cn('h-4 w-4 transition-transform', voting && 'animate-bounce')}
          />
          <span>{upvoteCount}</span>
        </button>

        {/* Comment count */}
        <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
          <MessageSquare className="h-4 w-4" />
          <span>{post.comment_count}</span>
        </button>
      </div>
    </article>
  );
}
