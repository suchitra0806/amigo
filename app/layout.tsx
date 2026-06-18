import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Amigo', template: '%s | Amigo' },
  description: 'Community & compliance hub for F-1 international students',
  keywords: ['F-1 visa', 'international students', 'OPT', 'tax', 'community'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('amigo_theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}` }} />
        {children}
      </body>
    </html>
  );
}
