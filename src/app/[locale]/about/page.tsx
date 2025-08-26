"use client";

import { Button } from "@/components/ui/Button";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale();
  const brand = 'MediTrack';

  const goals = [
    { icon: "📊", title: t('featureAccurate'), desc: "" },
    { icon: "🧠", title: t('featurePrivacy'), desc: "" },
    { icon: "🔒", title: t('featureFast'), desc: "" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title', { brand })}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('desc')}
          </p>
          <Link href={`/${locale}/login`}>
            <Button size="lg" className="text-lg px-8 py-4">
              {t('getStarted')}
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('mission')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('missionDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {goals.map((goal, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="text-4xl mb-4">{goal.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {goal.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 