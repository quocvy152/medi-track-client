"use client";

import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRightOnRectangleIcon, Bars3Icon, ChevronDownIcon, Cog6ToothIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
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

              <Link
                href={`/${locale}/articles`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive('/articles')
                    ? "text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/25"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50"
                }`}
              >
                {t('articles')}
              </Link>
              
              <Link
                href={`/${locale}/upload`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive('/upload') || pathname === `/${locale}` || pathname === `/${locale}/`
                    ? "text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/25"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50"
                }`}
              >
                {t('upload')}
              </Link>

              {isAuthenticated && (
                <Link
                  href={`/${locale}/history`}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive('/history')
                      ? "text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/25"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50"
                  }`}
                >
                  {t('history')}
                </Link>
              )}
              {!isAuthenticated ? (
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
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    aria-label="User menu"
                    aria-expanded={userMenuOpen}
                  >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-700">
                      {userAvatar ? (
                        <Image
                          src={userAvatar}
                          alt={userName || 'User'}
                          width={32}
                          height={32}
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
                      <span className="hidden lg:block text-sm font-medium text-gray-300 max-w-[120px] truncate">
                        {userName}
                      </span>
                    )}
                    <ChevronDownIcon
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700/50 py-1 z-50">
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-gray-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-700 flex-shrink-0">
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
                              <p className="text-sm font-semibold text-white truncate">
                                {userName}
                              </p>
                            )}
                            {userEmail && (
                              <p className="text-xs text-gray-400 truncate">
                                {userEmail}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {/* <Link
                          href={`/${locale}/profile`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                        >
                          <UserIcon className="w-5 h-5" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href={`/${locale}/settings`}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                        >
                          <Cog6ToothIcon className="w-5 h-5" />
                          <span>Settings</span>
                        </Link> */}
                        {/* <div className="border-t border-gray-700/50 my-1" /> */}
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              {/* <LanguageSwitcher /> */}
            </div>

            {/* Mobile right: language switch only */}
            {/* <div className="md:hidden">
              <LanguageSwitcher />
            </div> */}
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

          <Link 
            href={`/${locale}/articles`} 
            onClick={closeDrawer} 
            className={`mt-2 flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive('/articles') 
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/50 shadow-lg shadow-blue-500/25' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50'
            }`}
          >
            {t('articles')}
          </Link>

          <Link 
            href={`/${locale}/upload`} 
            onClick={closeDrawer} 
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive('/upload') || pathname === `/${locale}` || pathname === `/${locale}/`
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/50 shadow-lg shadow-blue-500/25' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50'
            }`}
          >
            {t('upload')}
          </Link>

          {isAuthenticated && (
            <Link 
              href={`/${locale}/history`} 
              onClick={closeDrawer} 
              className={`mt-2 flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive('/history') 
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/50 shadow-lg shadow-blue-500/25' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50'
              }`}
            >
              {t('history')}
            </Link>
          )}

          {!isAuthenticated ? (
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
            <>
              {/* User Info in Mobile Drawer */}
              <div className="mt-4 px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-700 flex-shrink-0">
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
                      <p className="text-sm font-semibold text-white truncate">
                        {userName}
                      </p>
                    )}
                    {userEmail && (
                      <p className="text-xs text-gray-400 truncate">
                        {userEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items in Mobile Drawer */}
              <Link
                href={`/${locale}/profile`}
                onClick={closeDrawer}
                className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50 transition-all duration-300"
              >
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link
                href={`/${locale}/settings`}
                onClick={closeDrawer}
                className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-600/50 transition-all duration-300"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-2 w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
