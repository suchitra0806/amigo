import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileForm from '@/components/profile/ProfileForm';

export const metadata: Metadata = { title: 'My Profile — Amigo' };

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-slate-100">
          My <span className="neon-text">Profile</span>
        </h1>
        <p className="text-xs text-slate-600">
          Your student identity — visible only to you
        </p>
      </div>
      <ProfileForm profile={profile} userId={user.id} />
    </div>
  );
}
