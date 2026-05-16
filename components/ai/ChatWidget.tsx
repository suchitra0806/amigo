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
    <div className="animate-slide-up fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] flex-col rounded-3xl border border-neutral-200 bg-white shadow-chibi-xl">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-3xl border-b border-neutral-100 bg-white px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-900 shadow-chibi">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-black text-neutral-900">
            Amigo <span className="neon-text">AI</span>
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 animate-pulse" />
            <p className="text-[10px] text-neutral-400 font-semibold">F-1 student assistant</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-3 py-2">
        <AlertTriangle className="h-3 w-3 flex-shrink-0 text-neutral-400" />
        <p className="text-[10px] text-neutral-500 font-semibold">
          Not legal/financial advice — verify with your DSO.
        </p>
      </div>

      {/* Messages */}
      <div className="chat-scroll flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap font-medium',
                msg.role === 'user'
                  ? 'rounded-br-sm bg-neutral-900 text-white'
                  : 'rounded-bl-sm bg-neutral-100 text-neutral-800 border border-neutral-200'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-neutral-100 border border-neutral-200 px-4 py-3">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-500" />
              <span className="text-xs text-neutral-400 font-semibold">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-neutral-100 p-3">
        <div className="flex items-end gap-2 rounded-2xl bg-neutral-100 px-3 py-2 ring-1 ring-neutral-200 focus-within:ring-neutral-900/20 transition-shadow">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about OPT, taxes, CPT…"
            className="max-h-28 flex-1 resize-none bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none font-medium"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className={cn(
              'mb-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl transition-all',
              input.trim() && !loading
                ? 'bg-neutral-900 text-white hover:bg-black shadow-chibi'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-neutral-400 font-medium">
          Powered by Gemini · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
