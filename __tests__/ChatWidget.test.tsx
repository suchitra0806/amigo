import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatWidget from '@/components/ai/ChatWidget';

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ message: 'AI response' }),
  });
});

describe('ChatWidget', () => {
  it('renders suggested question chips on open', () => {
    render(<ChatWidget onClose={() => {}} />);
    expect(screen.getByText('When should I apply for OPT?')).toBeInTheDocument();
    expect(screen.getByText('Do I owe FICA taxes on OPT?')).toBeInTheDocument();
  });

  it('hides chips after user sends a message', async () => {
    render(<ChatWidget onClose={() => {}} />);
    fireEvent.click(screen.getByText('When should I apply for OPT?'));
    expect(screen.queryByText('Do I owe FICA taxes on OPT?')).not.toBeInTheDocument();
  });

  it('calls onClose when the X button is clicked', () => {
    const onClose = vi.fn();
    render(<ChatWidget onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close chat'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('persists messages to localStorage after sending', () => {
    render(<ChatWidget onClose={() => {}} />);
    fireEvent.click(screen.getByText('When should I apply for OPT?'));
    const saved = JSON.parse(localStorage.getItem('amigo_chat_history') ?? '[]');
    expect(saved.some((m: { role: string; content: string }) => m.role === 'user')).toBe(true);
  });

  it('restores history from localStorage on mount', () => {
    const history = [
      { role: 'assistant', content: 'Hey!' },
      { role: 'user', content: 'What is CPT?' },
    ];
    localStorage.setItem('amigo_chat_history', JSON.stringify(history));
    render(<ChatWidget onClose={() => {}} />);
    expect(screen.getByText('What is CPT?')).toBeInTheDocument();
  });

  it('clears chat and localStorage when clear button is clicked', () => {
    const history = [
      { role: 'assistant', content: 'Hey!' },
      { role: 'user', content: 'What is CPT?' },
    ];
    localStorage.setItem('amigo_chat_history', JSON.stringify(history));
    render(<ChatWidget onClose={() => {}} />);
    fireEvent.click(screen.getByLabelText('Clear chat'));
    expect(screen.queryByText('What is CPT?')).not.toBeInTheDocument();
    expect(localStorage.getItem('amigo_chat_history')).toBeNull();
  });
});
