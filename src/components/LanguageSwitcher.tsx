'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Language {
  code: string;
  label: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

interface LanguageSwitcherProps {
  onLanguageChange: (lang: string) => void;
  currentLanguage: string;
}

export function LanguageSwitcher({ onLanguageChange, currentLanguage }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (langCode: string) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border-[rgba(212,175,55,0.3)] text-[#E8D5A3] hover:bg-[rgba(212,175,55,0.1)] hover:border-[#D4AF37] transition-all duration-300"
      >
        <span className="text-xl">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.label}</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 bg-[#0A0A0A] border border-[rgba(212,175,55,0.3)] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden min-w-[150px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                  lang.code === currentLanguage
                    ? 'bg-[rgba(212,175,55,0.2)] text-[#D4AF37]'
                    : 'text-[#F8F8F8] hover:bg-[rgba(212,175,55,0.1)]'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
