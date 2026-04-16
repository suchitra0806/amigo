'use client';

import { useState, useRef } from 'react';
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
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<PostCategory>('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      setTitle('');
      setBody('');
      setCategory('general');
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-slide-up w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Create Post</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
                    category === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Title <span className="text-red-500">*</span>
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
            <label className="mb-1.5 block text-xs font-medium text-slate-700">
              Body <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input min-h-[120px] resize-y"
              placeholder="Share details, ask a question, or start a discussion..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
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
