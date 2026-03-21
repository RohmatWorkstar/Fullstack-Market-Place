'use client';

import { useLanguageStore } from '@/stores/language-store';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { useEffect, useState } from 'react';

// We map keys of the dictionary section to extract precise translations dynamically
type DictSections = keyof typeof dictionaries.en;

interface TranslateProps {
  section: DictSections;
  textKey: string;
}

export default function Translate({ section, textKey }: TranslateProps) {
  const { language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const d = dictionaries[language] as any;
  const sectionData = d?.[section];
  const translatedText = sectionData ? sectionData[textKey] : textKey;

  if (!mounted) {
    // When server rendering, default to EN to match initial server HTML
    const enDict = dictionaries.en as any;
    const defaultText = enDict?.[section]?.[textKey] || textKey;
    return <span suppressHydrationWarning>{defaultText}</span>;
  }

  return <span suppressHydrationWarning>{translatedText}</span>;
}
