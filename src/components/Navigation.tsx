"use client";

import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRightOnRectangleIcon, Bars3Icon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('nav');
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout, isLoggingOut, user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const isActive = (path: string) => {
    if (!mounted || !pathname) return false;
    const fullPath = `/${locale}${path}`;
    // For history, also match sub-paths like /history/[id]
    if (path === '/history') {
      return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
    }
    // For upload, also match home page
    if (path === '/upload') {
      return pathname === fullPath || pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname === fullPath;
  };

  const closeDrawer = () => setDrawerOpen(false);

  const handleLogout = async () => {
    try {
      setUserMenuOpen(false);
      await logout();
      // Close drawer first
      closeDrawer();
      // Redirect to home page and refresh to ensure UI updates
      router.push(`/${locale}`);
      // Use setTimeout to ensure state is updated before refresh
      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      closeDrawer();
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Get user avatar or picture
  const getUserAvatar = () => {
    if (user && typeof user === 'object') {
      // Check for picture from social login
      if ('picture' in user && typeof user.picture === 'string') {
        return user.picture;
      }
      // Check for avatar
      if ('avatar' in user && typeof user.avatar === 'string') {
        return user.avatar;
      }
    }
    return null;
  };

  const userName = user && typeof user === 'object' && 'name' in user ? String(user.name) : '';
  const userEmail = user && typeof user === 'object' && 'email' in user ? String(user.email) : '';
  const userAvatar = getUserAvatar();
  const userInitials = getUserInitials(userName, userEmail);

  return (
    <>
      {/* Floating Modern Header */}
      <nav className="fixed top-4 left-4 right-4 z-50 md:top-6 md:left-6 md:right-6 lg:top-8 lg:left-8 lg:right-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-900/10 dark:shadow-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-20">
              {/* Mobile Menu Button */}
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setDrawerOpen(true)}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors duration-200 cursor-pointer"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>

              {/* Logo */}
              <Link 
                href={`/${locale}`} 
                className="flex items-center space-x-3 group cursor-pointer"
              >
                <div className="relative">
                  <Image
                    src="/images/medi_track_logo.png"
                    alt="MediTrack Logo"
                    width={140}
                    height={40}
                    className="object-contain h-8 md:h-10 w-auto transition-opacity duration-200 group-hover:opacity-90"
                    priority
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                <Link
                  href={`/${locale}/about`}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive('/about')
                      ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 shadow-sm"
                      : "text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {t('about')}
                </Link>

                <Link
                  href={`/${locale}/articles`}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive('/articles')
                      ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 shadow-sm"
                      : "text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {t('articles')}
                </Link>
                
                <Link
                  href={`/${locale}/upload`}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive('/upload') || pathname === `/${locale}` || pathname === `/${locale}/`
                      ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 shadow-sm"
                      : "text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {t('upload')}
                </Link>

                {isAuthenticated && (
                  <Link
                    href={`/${locale}/history`}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive('/history')
                        ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 shadow-sm"
                        : "text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {t('history')}
                  </Link>
                )}

                {/* Auth Section */}
                {!isAuthenticated ? (
                  <Link
                    href={`/${locale}/login`}
                    className={`ml-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive('/login')
                        ? "text-white bg-gradient-to-r from-cyan-600 to-cyan-500 shadow-md shadow-cyan-500/30"
                        : "text-white bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30"
                    }`}
                  >
                    {t('login')}
                  </Link>
                ) : (
                  <div className="relative ml-2" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
                      aria-label="User menu"
                      aria-expanded={userMenuOpen}
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center border-2 border-cyan-200 dark:border-cyan-800 shadow-sm">
                        {userAvatar ? (
                          <Image
                            src={userAvatar}
                            alt={userName || 'User'}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xs font-semibold">
                            {userInitials}
                          </span>
                        )}
                      </div>
                      {/* Name (hidden on small screens) */}
                      {userName && (
                        <span className="hidden lg:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                          {userName}
                        </span>
                      )}
                      <ChevronDownIcon
                        className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                          userMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 backdrop-blur-sm">
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center border-2 border-cyan-200 dark:border-cyan-800 flex-shrink-0 shadow-sm">
                              {userAvatar ? (
                                <Image
                                  src={userAvatar}
                                  alt={userName || 'User'}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white text-sm font-semibold">
                                  {userInitials}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              {userName && (
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                  {userName}
                                </p>
                              )}
                              {userEmail && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {userEmail}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {isLoggingOut ? (
                              <>
                                <Loading size="sm" />
                                <span>Logging out...</span>
                              </>
                            ) : (
                              <>
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                <span>{t('logout')}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {drawerOpen && (
        <button
          aria-label="Close menu"
          onClick={closeDrawer}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Modern Side Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-out md:hidden shadow-2xl ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!drawerOpen}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/medi_track_logo.png"
              alt="MediTrack Logo"
              width={120}
              height={35}
              className="object-contain h-7"
            />
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeDrawer}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors duration-200 cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="px-4 py-6 space-y-2">
          <Link 
            href={`/${locale}/about`} 
            onClick={closeDrawer} 
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive('/about') 
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 shadow-sm' 
                : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {t('about')}
          </Link>

          <Link 
            href={`/${locale}/articles`} 
            onClick={closeDrawer} 
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive('/articles') 
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 shadow-sm' 
                : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {t('articles')}
          </Link>

          <Link 
            href={`/${locale}/upload`} 
            onClick={closeDrawer} 
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive('/upload') || pathname === `/${locale}` || pathname === `/${locale}/`
                ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 shadow-sm' 
                : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {t('upload')}
          </Link>

          {isAuthenticated && (
            <Link 
              href={`/${locale}/history`} 
              onClick={closeDrawer} 
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive('/history') 
                  ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 shadow-sm' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {t('history')}
            </Link>
          )}

          {!isAuthenticated ? (
            <Link 
              href={`/${locale}/login`} 
              onClick={closeDrawer} 
              className={`mt-4 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-cyan-500 shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200 cursor-pointer ${
                isActive('/login') 
                  ? 'ring-2 ring-cyan-500/50' 
                  : ''
              }`}
            >
              {t('login')}
            </Link>
          ) : (
            <>
              {/* User Info in Mobile Drawer */}
              <div className="mt-6 px-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center border-2 border-cyan-200 dark:border-cyan-800 flex-shrink-0 shadow-sm">
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt={userName || 'User'}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-base font-semibold">
                        {userInitials}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {userName && (
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {userName}
                      </p>
                    )}
                    {userEmail && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {userEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Logout Button in Mobile Drawer */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-4 w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 cursor-pointer"
              >
                {isLoggingOut ? (
                  <>
                    <Loading size="sm" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>{t('logout')}</span>
                  </>
                )}
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
} 
