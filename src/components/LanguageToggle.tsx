'use client';

import { useLanguageStore } from '@/stores/language-store';
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-surface-500 bg-surface-100 animate-pulse text-sm font-medium">
        <Globe className="w-4 h-4" />
        <span className="opacity-0">EN</span>
      </button>
    );
  }

  const toggleLang = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-surface-600 hover:text-primary-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-primary-400 dark:hover:bg-surface-800 transition-colors text-sm font-medium border border-transparent hover:border-surface-200 dark:hover:border-surface-700"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{language}</span>
    </button>
  );
}
