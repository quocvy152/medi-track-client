'use client';

import {
  HeartIcon,
  HomeIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'vi';

  const quickLinks = [
    { href: `/${locale}`, label: t('home'), icon: HomeIcon },
    { href: `/${locale}/about`, label: t('about'), icon: InformationCircleIcon },
    { href: `/${locale}/articles`, label: t('articles'), icon: BookOpenIcon },
    { href: `/${locale}/upload`, label: t('upload'), icon: DocumentTextIcon },
  ];

  const resources = [
    { href: `/${locale}/terms`, label: t('terms'), icon: ShieldCheckIcon },
    { href: `/${locale}/terms`, label: t('privacy'), icon: ShieldCheckIcon },
    { href: '#', label: t('support'), icon: QuestionMarkCircleIcon },
    { href: '#', label: t('contact'), icon: EnvelopeIcon },
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href={`/${locale}`} className="inline-block mb-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/images/medi_track_logo.png"
                    alt="MediTrack Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <span className="text-xl font-bold text-white">MediTrack</span>
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {t('description')}
              </p>
              {/* Social Links - Optional, can be added later */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <HeartIcon className="w-5 h-5 text-red-500" />
                  <span className="text-xs">{t('madeWith')}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {t('quickLinks')}
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                      >
                        <Icon className="w-4 h-4 group-hover:text-blue-400 transition-colors duration-200" />
                        <span className="text-sm">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {t('resources')}
              </h3>
              <ul className="space-y-3">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <li key={`${resource.href}-${resource.label}-${index}`}>
                      <Link
                        href={resource.href}
                        className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                      >
                        <Icon className="w-4 h-4 group-hover:text-purple-400 transition-colors duration-200" />
                        <span className="text-sm">{resource.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact & Info */}
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {t('contact')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2 text-gray-400">
                  <EnvelopeIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <a
                    href="mailto:support@meditrack.com"
                    className="text-sm hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    support@meditrack.com
                  </a>
                </li>
                <li className="flex items-start space-x-2 text-gray-400">
                  <ClockIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{t('supportHours')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              {t('copyright', { year: currentYear })}
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href={`/${locale}/terms`}
                className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {t('terms')}
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href={`/${locale}/terms`}
                className="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {t('privacy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 