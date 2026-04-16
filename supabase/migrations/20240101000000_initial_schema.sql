-- ============================================================
-- Amigo — Initial Schema Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE post_category AS ENUM (
  'tax',
  'work',
  'social',
  'housing',
  'visa',
  'general'
);

CREATE TYPE visa_status AS ENUM (
  'F-1',
  'OPT',
  'STEM OPT',
  'Other'
);

CREATE TYPE work_type AS ENUM (
  'on-campus',
  'CPT',
  'OPT',
  'STEM OPT'
);

-- ============================================================
-- TABLES
-- ============================================================

-- profiles: one row per authenticated user, auto-created on signup
CREATE TABLE profiles (
  id            UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username      TEXT        UNIQUE NOT NULL,
  full_name     TEXT        NOT NULL DEFAULT '',
  university    TEXT,
  graduation_year INTEGER   CHECK (graduation_year BETWEEN 2020 AND 2035),
  visa_status   visa_status NOT NULL DEFAULT 'F-1',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- posts: community feed entries with upvote counter
CREATE TABLE posts (
  id            UUID          DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id     UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title         TEXT          NOT NULL CHECK (char_length(title) BETWEEN 3 AND 300),
  body          TEXT          NOT NULL CHECK (char_length(body) >= 10),
  category      post_category NOT NULL DEFAULT 'general',
  upvote_count  INTEGER       NOT NULL DEFAULT 0 CHECK (upvote_count >= 0),
  comment_count INTEGER       NOT NULL DEFAULT 0 CHECK (comment_count >= 0),
  is_pinned     BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- post_votes: prevents duplicate votes; drives upvote_count
CREATE TABLE post_votes (
  post_id    UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- comments: threaded replies to posts
CREATE TABLE comments (
  id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id    UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id  UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body       TEXT        NOT NULL CHECK (char_length(body) >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- work_logs: weekly hour tracking for F-1 compliance (20 hr on-campus limit)
CREATE TABLE work_logs (
  id           UUID      DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID      NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start   DATE      NOT NULL,                   -- Monday of the tracked week
  hours_worked NUMERIC(5, 2) NOT NULL CHECK (hours_worked >= 0 AND hours_worked <= 168),
  employer     TEXT,
  work_type    work_type NOT NULL DEFAULT 'on-campus',
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, week_start)                       -- one entry per user per week
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_logs   ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles: public read"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "profiles: insert own"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- posts
CREATE POLICY "posts: public read"
  ON posts FOR SELECT USING (true);

CREATE POLICY "posts: authenticated insert"
  ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts: author update"
  ON posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "posts: author delete"
  ON posts FOR DELETE USING (auth.uid() = author_id);

-- post_votes
CREATE POLICY "votes: public read"
  ON post_votes FOR SELECT USING (true);

CREATE POLICY "votes: authenticated insert"
  ON post_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes: own delete"
  ON post_votes FOR DELETE USING (auth.uid() = user_id);

-- comments
CREATE POLICY "comments: public read"
  ON comments FOR SELECT USING (true);

CREATE POLICY "comments: authenticated insert"
  ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "comments: author delete"
  ON comments FOR DELETE USING (auth.uid() = author_id);

-- work_logs (private — only owner)
CREATE POLICY "work_logs: owner read"
  ON work_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "work_logs: owner insert"
  ON work_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "work_logs: owner update"
  ON work_logs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "work_logs: owner delete"
  ON work_logs FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9]', '', 'g'))
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Atomic vote toggle — increments/decrements upvote_count safely
CREATE OR REPLACE FUNCTION toggle_post_vote(p_post_id UUID, p_user_id UUID)
RETURNS TABLE (new_upvote_count INTEGER, user_voted BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_existed BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM post_votes
    WHERE post_id = p_post_id AND user_id = p_user_id
  ) INTO v_existed;

  IF v_existed THEN
    DELETE FROM post_votes WHERE post_id = p_post_id AND user_id = p_user_id;
    UPDATE posts SET upvote_count = upvote_count - 1 WHERE id = p_post_id;
  ELSE
    INSERT INTO post_votes (post_id, user_id) VALUES (p_post_id, p_user_id);
    UPDATE posts SET upvote_count = upvote_count + 1 WHERE id = p_post_id;
  END IF;

  RETURN QUERY
    SELECT p.upvote_count, (NOT v_existed)
    FROM posts p WHERE p.id = p_post_id;
END;
$$;

-- Auto-sync comment_count on comments insert/delete
CREATE OR REPLACE FUNCTION sync_comment_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_sync_comment_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION sync_comment_count();

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_posts_category    ON posts (category);
CREATE INDEX idx_posts_created_at  ON posts (created_at DESC);
CREATE INDEX idx_posts_author      ON posts (author_id);
CREATE INDEX idx_post_votes_user   ON post_votes (user_id);
CREATE INDEX idx_comments_post     ON comments (post_id);
CREATE INDEX idx_work_logs_user    ON work_logs (user_id, week_start DESC);
