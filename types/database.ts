export type PostCategory = 'tax' | 'work' | 'social' | 'housing' | 'visa' | 'general';
export type VisaStatus = 'F-1' | 'OPT' | 'STEM OPT' | 'Other';
export type WorkType = 'on-campus' | 'CPT' | 'OPT' | 'STEM OPT';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  university: string | null;
  graduation_year: number | null;
  visa_status: VisaStatus;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  title: string;
  body: string;
  category: PostCategory;
  upvote_count: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostWithAuthor extends Post {
  profiles: Pick<Profile, 'username' | 'avatar_url'>;
  user_voted?: boolean;
}

export interface PostVote {
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles?: Pick<Profile, 'username' | 'avatar_url'>;
}

export interface WorkLog {
  id: string;
  user_id: string;
  week_start: string;
  hours_worked: number;
  employer: string | null;
  work_type: WorkType;
  notes: string | null;
  created_at: string;
}

// Supabase RPC return shape
export interface ToggleVoteResult {
  new_upvote_count: number;
  user_voted: boolean;
}
