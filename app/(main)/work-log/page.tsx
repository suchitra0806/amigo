import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WorkLogClient from './WorkLogClient';

export const metadata: Metadata = { title: 'Work Log' };

export default async function WorkLogPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: logs } = await supabase
    .from('work_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('week_start', { ascending: false })
    .limit(20);

  return <WorkLogClient initialLogs={logs ?? []} userId={user.id} />;
}
