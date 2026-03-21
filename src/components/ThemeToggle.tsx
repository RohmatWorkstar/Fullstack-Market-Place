'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 p-2.5 rounded-full text-surface-500 bg-surface-100 animate-pulse">
        <span className="opacity-0">T</span>
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-10 h-10 flex items-center justify-center rounded-full text-surface-600 hover:text-primary-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-primary-400 dark:hover:bg-surface-800 transition-colors"
      aria-label="Toggle dark mode"
    >
      <Sun className={`w-5 h-5 transition-transform duration-500 ${isDark ? 'scale-0 rotate-90 absolute' : 'scale-100 rotate-0'}`} />
      <Moon className={`w-5 h-5 transition-transform duration-500 ${isDark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90 absolute'}`} />
    </button>
  );
}
