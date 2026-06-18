'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('amigo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('amigo_theme', 'light');
    }
  }

  return (
    <button onClick={toggle} className="nav-link w-full">
      {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      {dark ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
