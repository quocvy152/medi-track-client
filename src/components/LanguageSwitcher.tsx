"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LOCALES: { code: "vi" | "en"; label: string; flag: string }[] = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
  const locale = useLocale() as "vi" | "en";
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const current = LOCALES.find(l => l.code === locale) ?? LOCALES[0];

  const switchTo = (target: "vi" | "en") => {
    if (!pathname) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${target}`);
      return;
    }
    segments[0] = target; // replace locale segment
    router.push(`/${segments.join("/")}`);
    setOpen(false);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Keyboard handling
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
      >
        <span className="text-base" aria-hidden>{current.flag}</span>
        <span>{current.label}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : "rotate-0"}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="listbox"
          className="absolute right-0 mt-2 w-44 rounded-md border border-gray-200 bg-white shadow-lg z-50 overflow-hidden"
        >
          {LOCALES.map(item => (
            <button
              key={item.code}
              role="option"
              aria-selected={item.code === locale}
              onClick={() => switchTo(item.code)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 ${
                item.code === locale ? "bg-blue-50 text-blue-700" : "text-gray-800"
              }`}
            >
              <span className="text-base" aria-hidden>{item.flag}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 