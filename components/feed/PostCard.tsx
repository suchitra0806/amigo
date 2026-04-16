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
  const [userVoted, setUserVoted]     = useState(post.user_voted ?? false);
  const [voting, setVoting]           = useState(false);

  const meta           = CATEGORY_META[post.category];
  const authorUsername = post.profiles?.username ?? 'unknown';
  const avatarUrl      = getAvatarUrl(authorUsername, post.profiles?.avatar_url);

  async function handleUpvote() {
    if (!currentUserId || voting) return;

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
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUpvoteCount(data.upvote_count);
      setUserVoted(data.user_voted);
    } catch {
      setUserVoted(wasVoted);
      setUpvoteCount((c) => (wasVoted ? c + 1 : c - 1));
    } finally {
      setVoting(false);
    }
  }

  return (
    <article className="card-glow p-5 group">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Image
            src={avatarUrl}
            alt={authorUsername}
            width={30}
            height={30}
            className="rounded-full ring-1 ring-slate-700"
          />
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-slate-300">@{authorUsername}</span>
            <span className="text-[11px] text-slate-600">{timeAgo(post.created_at)}</span>
          </div>
        </div>

        {/* Category badge */}
        <span className={cn('badge text-[11px]', meta.color, meta.bg, meta.border)}>
          {meta.label}
        </span>
      </div>

      {/* Content */}
      <h3 className="mb-1.5 text-sm font-semibold text-slate-100 leading-snug group-hover:text-white transition-colors">
        {post.title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-500">
        {clampText(post.body, 200)}
      </p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleUpvote}
          disabled={voting}
          aria-label={userVoted ? 'Remove upvote' : 'Upvote'}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
            userVoted
              ? 'bg-violet-500/15 text-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.2)]'
              : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300',
            !currentUserId && 'cursor-default opacity-50'
          )}
        >
          <ArrowUp className={cn('h-3.5 w-3.5', userVoted && 'text-violet-400')} />
          <span>{upvoteCount}</span>
        </button>

        <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{post.comment_count}</span>
        </button>
      </div>
    </article>
  );
}
