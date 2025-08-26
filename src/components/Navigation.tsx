"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('nav');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => mounted && pathname === `/${locale}${path}`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src="/images/medi_track_logo.png"
                alt="MediTrack Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-gray-900">{t('brand')}</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href={`/${locale}/about`}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/about')
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {t('about')}
            </Link>
            <Link
              href={`/${locale}/login`}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/login')
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              {t('login')}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
} 