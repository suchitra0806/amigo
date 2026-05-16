'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [mode, setMode]         = useState<'login' | 'signup'>('login');
  const router   = useRouter();
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
        router.push('/dashboard'); router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-neutral-50 px-4"
      style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-neutral-900 shadow-chibi">
            <GraduationCap className="h-8 w-8 text-white" />
            <span className="absolute inset-0 rounded-3xl ring-2 ring-black/10 animate-pulse-slow" />
          </div>
          <h1 className="text-2xl font-black">
            Welcome to <span className="neon-text">Amigo</span>
          </h1>
          <p className="mt-1 text-sm text-neutral-500 font-semibold">Your F-1 student portal</p>
        </div>

        {/* Card */}
        <div className="card p-6 shadow-chibi">
          {/* Toggle */}
          <div className="mb-5 flex rounded-2xl bg-neutral-100 p-1">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-xl py-2 text-sm font-bold transition-all capitalize ${
                  mode === m
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  error.startsWith('✓')
                    ? 'bg-neutral-100 border-neutral-300 text-neutral-700'
                    : 'bg-neutral-900/5 border-neutral-900/15 text-neutral-900'
                }`}
              >
                {error}
              </p>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-black text-neutral-500 uppercase tracking-wider">
                University Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black text-neutral-500 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-1"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-neutral-400 font-semibold">
          Student portal only — not a source of legal or tax advice.
        </p>

        <div className="mt-3 flex items-center justify-center">
          <Link
            href="/dashboard"
            className="text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Continue as guest →
          </Link>
        </div>
      </div>
    </div>
  );
}
