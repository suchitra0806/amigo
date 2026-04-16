import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { PostCategory } from '@/types/database';

const VALID_CATEGORIES: PostCategory[] = ['tax', 'work', 'social', 'housing', 'visa', 'general'];

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, body: postBody, category } = body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
  }

  if (!postBody || typeof postBody !== 'string' || postBody.trim().length < 10) {
    return NextResponse.json({ error: 'Body must be at least 10 characters' }, { status: 400 });
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      title: title.trim(),
      body: postBody.trim(),
      category,
    })
    .select('*, profiles(username, avatar_url)')
    .single();

  if (error) {
    console.error('[POST /api/posts]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
