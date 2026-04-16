'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, GraduationCap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME: Message = {
  role: 'assistant',
  content:
    "Hey! I'm Amigo AI — your F-1 compliance companion.\n\nAsk me about taxes, OPT/CPT, work authorization, FBAR, or anything else on your mind.\n\n⚠️ I'm an AI, not a lawyer or CPA. Always verify with your DSO.",
};

export default function ChatWidget({ onClose: _onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages((p) => [...p, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages((p) => [...p, { role: 'assistant', content: 'Error reaching AI. Try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className="animate-slide-up fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-2xl border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 shadow-neon-purple">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">Amigo <span className="neon-text">AI</span></p>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)] animate-pulse" />
            <p className="text-[10px] text-slate-500">F-1 student assistant</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-1.5 border-b border-amber-500/15 bg-amber-500/5 px-3 py-2">
        <AlertTriangle className="h-3 w-3 flex-shrink-0 text-amber-400" />
        <p className="text-[10px] text-amber-400/80">
          Not legal/financial advice — verify with your DSO.
        </p>
      </div>

      {/* Messages */}
      <div className="chat-scroll flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                msg.role === 'user'
                  ? 'rounded-br-sm bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : 'rounded-bl-sm bg-slate-800 text-slate-300 border border-slate-700'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-800 border border-slate-700 px-4 py-3">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400" />
              <span className="text-xs text-slate-500">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-end gap-2 rounded-xl bg-slate-800 px-3 py-2 ring-1 ring-slate-700 focus-within:ring-violet-500/40 transition-shadow">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about OPT, taxes, CPT…"
            className="max-h-28 flex-1 resize-none bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className={cn(
              'mb-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all',
              input.trim() && !loading
                ? 'bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-slate-700">
          Powered by Gemini · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
