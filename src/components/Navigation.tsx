"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
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
  const [isAuthed, setIsAuthed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('isLoggedIn');
      setIsAuthed(!!token);
    } catch {
      setIsAuthed(false);
    }
  }, []);

  const isActive = (path: string) => mounted && pathname === `/${locale}${path}`;

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="bg-white-600 rounded-lg flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/medi_track_logo.png"
                  alt="MediTrack Logo"
                  width={200}
                  height={200}
                  className="object-contain"
                  priority
                />
              </div>
              {/* <span className="text-xl font-bold text-gray-900">{t('brand')}</span> */}
            </Link>

            {/* Right actions */}
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
                href={`/${locale}/upload`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/upload')
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {t('upload')}
              </Link>
              {!isAuthed && (
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
              )}
              <LanguageSwitcher />
            </div>

            {/* Mobile right: language switch only */}
            <div className="md:hidden">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {drawerOpen && (
        <button
          aria-label="Close menu"
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Side drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-out md:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!drawerOpen}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-100">
          <span className="text-base font-semibold text-gray-900">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeDrawer}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-2 py-3">
          <Link href={`/${locale}`} onClick={closeDrawer} className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${isActive('') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'}`}>
            {t('brand')}
          </Link>
          <Link href={`/${locale}/upload`} onClick={closeDrawer} className={`mt-1 flex items-center px-3 py-2 rounded-lg text-sm font-medium ${isActive('/upload') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'}`}>
            {t('upload')}
          </Link>
          <Link href={`/${locale}/about`} onClick={closeDrawer} className={`mt-1 flex items-center px-3 py-2 rounded-lg text-sm font-medium ${isActive('/about') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'}`}>
            {t('about')}
          </Link>
          {!isAuthed && (
            <Link href={`/${locale}/login`} onClick={closeDrawer} className={`mt-1 flex items-center px-3 py-2 rounded-lg text-sm font-medium ${isActive('/login') ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-100'}`}>
              {t('login')}
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
} 