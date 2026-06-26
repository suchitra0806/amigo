import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatWidget from '@/components/ai/ChatWidget';

beforeEach(() => {
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
    const chip = screen.getByText('When should I apply for OPT?');
    fireEvent.click(chip);
    expect(screen.queryByText('Do I owe FICA taxes on OPT?')).not.toBeInTheDocument();
  });

  it('calls onClose when the X button is clicked', () => {
    const onClose = vi.fn();
    render(<ChatWidget onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close chat'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
