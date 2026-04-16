'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PostCategory } from '@/types/database';

const CATEGORIES: PostCategory[] = ['tax', 'work', 'social', 'housing', 'visa', 'general'];

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onCreated }: CreatePostModalProps) {
  const [title, setTitle]       = useState('');
  const [body, setBody]         = useState('');
  const [category, setCategory] = useState<PostCategory>('general');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), category }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to create post');
      }
      setTitle(''); setBody(''); setCategory('general');
      onCreated(); onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-slide-up w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-100">Create Post</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="rounded-lg bg-pink-500/10 border border-pink-500/20 px-3 py-2 text-sm text-pink-400">
              {error}
            </p>
          )}

          {/* Category */}
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500 uppercase tracking-wider">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium capitalize transition-all border',
                    category === cat
                      ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                      : 'bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-600 hover:text-slate-300'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wider">
              Title
            </label>
            <input
              className="input"
              placeholder="What's on your mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={300}
              required
            />
          </div>

          {/* Body */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500 uppercase tracking-wider">
              Body
            </label>
            <textarea
              className="input min-h-[110px] resize-y"
              placeholder="Share details, ask a question, start a discussion…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !body.trim()}
              className="btn-primary"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
