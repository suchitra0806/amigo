'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatWidget from './ChatWidget';

export default function AmigoFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat widget panel */}
      {isOpen && <ChatWidget onClose={() => setIsOpen(false)} />}

      {/* Floating action button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close Amigo AI' : 'Open Amigo AI'}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200',
          'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white',
          'hover:from-indigo-600 hover:to-indigo-800 hover:scale-105 active:scale-95',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2'
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
