import type { Metadata } from 'next';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: { default: 'Amigo', template: '%s | Amigo' },
  description: 'Community & compliance hub for F-1 international students',
  keywords: ['F-1 visa', 'international students', 'OPT', 'tax', 'community'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
