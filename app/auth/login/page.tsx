'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Loader2, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [mode, setMode]         = useState<'login' | 'signup'>('login');
  const router  = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setError('✓ Check your email to confirm your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/feed'); router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4"
         style={{ backgroundImage: 'radial-gradient(rgba(167,139,250,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-neon-purple">
            <GraduationCap className="h-8 w-8 text-white" />
            <span className="absolute inset-0 rounded-2xl ring-2 ring-violet-500/40 animate-pulse-slow" />
          </div>
          <h1 className="text-2xl font-bold">
            Welcome to <span className="neon-text">Amigo</span>
          </h1>
          <p className="mt-1 text-sm text-slate-600">Your F-1 student community hub</p>
        </div>

        {/* Card */}
        <div className="card border border-slate-800 p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
          {/* Toggle */}
          <div className="mb-5 flex rounded-lg bg-slate-800 p-1">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all capitalize ${
                  mode === m
                    ? 'bg-slate-700 text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className={`rounded-lg border px-3 py-2 text-sm ${
                error.startsWith('✓')
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-pink-500/10 border-pink-500/20 text-pink-400'
              }`}>
                {error}
              </p>
            )}

            <div>
              <label className="mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">
                University Email
              </label>
              <input
                type="email" className="input" placeholder="you@university.edu"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password" className="input" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                minLength={6} required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-1">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-700">
          Community platform only — not a source of legal or tax advice.
        </p>

        <div className="mt-3 flex items-center justify-center gap-1">
          <Zap className="h-3 w-3 text-violet-600" />
          <Link href="/feed" className="text-xs text-violet-500 hover:text-violet-400 transition-colors">
            Browse as guest →
          </Link>
        </div>
      </div>
    </div>
  );
}
