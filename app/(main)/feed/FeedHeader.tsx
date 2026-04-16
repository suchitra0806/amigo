'use client';

import { useState } from 'react';
import { PenSquare } from 'lucide-react';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { useRouter } from 'next/navigation';

interface FeedHeaderProps {
  userId?: string;
}

export default function FeedHeader({ userId }: FeedHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Community Feed</h1>
        <p className="text-sm text-slate-500">Questions, tips & experiences from F-1 students</p>
      </div>

      {userId ? (
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
        >
          <PenSquare className="h-4 w-4" />
          Post
        </button>
      ) : (
        <a href="/auth/login" className="btn-secondary text-sm">
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
