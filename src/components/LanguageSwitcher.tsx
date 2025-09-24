"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";

const LOCALES: { code: "vi" | "en"; label: string; flag: string }[] = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Extract locale from pathname instead of useLocale hook
  const locale = (pathname?.split('/')[1] as "vi" | "en") || "vi";
  const current = LOCALES.find(l => l.code === locale) ?? LOCALES[0];

  // Disabled mode: no open state, no router navigation
  return (
    <div className="relative" aria-disabled>
      <button
        ref={buttonRef}
        disabled
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm text-gray-500 shadow-sm cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={false}
        aria-label="Language switcher disabled"
        title="Tính năng chuyển ngôn ngữ đang tạm tắt"
      >
        <span className="text-base" aria-hidden>{current.flag}</span>
        <span>{current.label}</span>
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
} 