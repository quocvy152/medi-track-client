"use client";

import { Button } from "@/components/ui/Button";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const brand = 'MediTrack';

  const features = [
    { title: "📊", description: "Track Results" },
    { title: "🧠", description: "Smart Analysis" },
    { title: "🔒", description: "Secure & Private" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('title', { brand })}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/login`}>
              <Button size="lg" className="text-lg px-8 py-4">
                {t('ctaGetStarted')}
              </Button>
            </Link>
            <Link href={`/${locale}/about`}>
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                {t('ctaLearnMore')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('why')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {/* Placeholder text remains same across locales */}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 text-center">
                <div className="text-5xl mb-4">{feature.title}</div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('ctaSectionTitle')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('ctaSectionSubtitle')}
          </p>
          <Link href={`/${locale}/login`}>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
              {t('ctaSectionButton')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
} 