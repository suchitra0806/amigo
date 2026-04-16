'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, GraduationCap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hi! I'm Amigo AI, your F-1 student companion. I can help with questions about taxes, OPT/CPT, work authorization, and general compliance. What's on your mind?\n\n⚠️ _Reminder: I'm an AI assistant, not a licensed attorney or CPA. Always verify with your DSO or a qualified professional._",
};

interface ChatWidgetProps {
  onClose: () => void;
}

export default function ChatWidget({ onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!res.ok) throw new Error('Request failed');

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I ran into an error. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="animate-slide-up fixed bottom-24 right-6 z-50 flex h-[500px] w-[360px] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 rounded-t-2xl border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Amigo AI</p>
          <p className="text-xs text-indigo-200">F-1 student assistant</p>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="flex items-start gap-1.5 border-b border-amber-100 bg-amber-50 px-3 py-2">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
        <p className="text-[10px] leading-snug text-amber-700">
          Not legal/financial advice. Consult your DSO or a licensed professional for official guidance.
        </p>
      </div>

      {/* Messages */}
      <div className="chat-scroll flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                msg.role === 'user'
                  ? 'rounded-br-sm bg-indigo-600 text-white'
                  : 'rounded-bl-sm bg-slate-100 text-slate-800'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-sm text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-end gap-2 rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 focus-within:ring-indigo-400 transition-shadow">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about OPT, taxes, CPT…"
            className="max-h-28 flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className={cn(
              'mb-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
              input.trim() && !loading
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            )}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-slate-400">
          Powered by Gemini · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
