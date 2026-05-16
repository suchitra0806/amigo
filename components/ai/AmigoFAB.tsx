'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ChatWidget from './ChatWidget';

export default function AmigoFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatWidget onClose={() => setIsOpen(false)} />}

      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close Amigo AI' : 'Open Amigo AI'}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200',
          'bg-neutral-900 text-white',
          'shadow-chibi',
          'hover:bg-black hover:shadow-chibi-lg hover:scale-105',
          'active:scale-95',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2',
          isOpen && 'rotate-90'
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
