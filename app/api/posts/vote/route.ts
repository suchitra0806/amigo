import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized — sign in to vote' }, { status: 401 });
  }

  const { postId } = await request.json();

  if (!postId || typeof postId !== 'string') {
    return NextResponse.json({ error: 'Invalid postId' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('toggle_post_vote', {
    p_post_id: postId,
    p_user_id: user.id,
  });

  if (error) {
    console.error('[POST /api/posts/vote]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = Array.isArray(data) ? data[0] : data;

  return NextResponse.json({
    upvote_count: result.new_upvote_count,
    user_voted: result.user_voted,
  });
}
