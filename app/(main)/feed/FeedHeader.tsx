'use client';

import { useState } from 'react';
import { PenSquare } from 'lucide-react';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { useRouter } from 'next/navigation';

export default function FeedHeader({ userId }: { userId?: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-slate-100">
          Community <span className="neon-text">Feed</span>
        </h1>
        <p className="text-xs text-slate-600">Questions, tips & experiences from F-1 students</p>
      </div>

      {userId ? (
        <button onClick={() => setModalOpen(true)} className="btn-primary text-xs px-3 py-1.5">
          <PenSquare className="h-3.5 w-3.5" />
          Post
        </button>
      ) : (
        <a href="/auth/login" className="btn-secondary text-xs px-3 py-1.5">
          Sign in to post
        </a>
      )}

      <CreatePostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => router.refresh()}
      />
    </div>
  );
}
