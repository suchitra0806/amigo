import type { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import PostList from '@/components/feed/PostList';
import type { PostWithAuthor } from '@/types/database';
import FeedHeader from './FeedHeader';

export const metadata: Metadata = { title: 'Community Feed' };

export const revalidate = 60; // ISR — refresh every 60 seconds

export default async function FeedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch posts with author info
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url)')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch the current user's votes so we can pre-fill the voted state
  let votedPostIds = new Set<string>();
  if (user) {
    const { data: votes } = await supabase
      .from('post_votes')
      .select('post_id')
      .eq('user_id', user.id);
    votedPostIds = new Set((votes ?? []).map((v) => v.post_id));
  }

  const postsWithVotes: PostWithAuthor[] = (posts ?? []).map((p) => ({
    ...p,
    user_voted: votedPostIds.has(p.id),
  }));

  return (
    <div>
      <FeedHeader userId={user?.id} />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load posts. Please refresh.
        </div>
      )}

      <PostList posts={postsWithVotes} currentUserId={user?.id} />
    </div>
  );
}
