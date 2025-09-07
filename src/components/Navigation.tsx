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

  // Function to check authentication status
  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('isLoggedIn');
      setIsAuthed(!!token);
    } catch {
      setIsAuthed(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuthStatus();

    // Listen for storage changes (when login/logout happens in other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'isLoggedIn') {
        checkAuthStatus();
      }
    };

    // Listen for custom events (for same-tab communication)
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const isActive = (path: string) => mounted && pathname === `/${locale}${path}`;

  const closeDrawer = () => setDrawerOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsAuthed(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authStateChanged'));
    
    // Refresh the page to update the state
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-gray-900/95 backdrop-blur-sm shadow-2xl border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link href={`/${locale}`} className="hidden md:flex items-center space-x-2">
              <Image
                src="/images/medi_track_logo.png"
                alt="MediTrack Logo"
                width={150}
                height={150}
                className="object-contain"
                priority
              />
            </Link>

            {/* Right actions */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href={`/${locale}/about`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive('/about')
                    ? "text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/25"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50"
                }`}
              >
                {t('about')}
              </Link>
              {!isAuthed ? (
                <Link
                  href={`/${locale}/login`}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive('/login')
                      ? "text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/25"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50"
                  }`}
                >
                  {t('login')}
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-600/50 transition-all duration-300"
                >
                  {t('logout')}
                </button>
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Side drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 z-50 transform transition-transform duration-300 ease-out md:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!drawerOpen}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-700/50">
          <span className="text-base font-semibold text-white">Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeDrawer}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-2 py-3">
          <Link 
            href={`/${locale}`} 
            onClick={closeDrawer} 
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive('') 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/50 shadow-lg shadow-blue-500/25' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50'
            }`}
          >
            {t('upload')}
          </Link>

          <Link 
            href={`/${locale}/about`} 
            onClick={closeDrawer} 
            className={`mt-2 flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive('/about') 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/50 shadow-lg shadow-blue-500/25' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50'
            }`}
          >
            {t('about')}
          </Link>
          {!isAuthed ? (
            <Link 
              href={`/${locale}/login`} 
              onClick={closeDrawer} 
              className={`mt-2 flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/login') 
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/50 shadow-lg shadow-blue-500/25' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50'
              }`}
            >
              {t('login')}
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                closeDrawer();
              }}
              className="mt-2 w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-600/50 transition-all duration-300"
            >
              {t('logout')}
            </button>
          )}
        </nav>
      </aside>
    </>
  );
} 