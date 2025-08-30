'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import toast from 'react-hot-toast';
import Button from './ui/Button';

export type TermsAndPolicyPageProps = {
	isFirstVisit?: boolean;
	onAgree?: () => void;
	className?: string;
};

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
	return (
		<section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
			<h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
			<div className="prose max-w-none prose-p:leading-relaxed prose-ul:list-disc prose-li:marker:text-gray-400 text-gray-700">
				{children}
			</div>
		</section>
	);
};

const TermsAndPolicyPage: React.FC<TermsAndPolicyPageProps> = ({ isFirstVisit = false, className }) => {
	const t = useTranslations('terms');

	const handleAgree = () => {
		localStorage.setItem('termsAccepted', 'true');
		toast.success(t('agreementSuccess'));
		// You can add navigation logic here if needed
	};

	return (
		<div className={`min-h-screen w-full bg-gray-50 flex flex-col ${className ?? ''}`}>
			<header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
				<div className="mx-auto w-full max-w-4xl px-4 py-5">
					<h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('title')}</h1>
					<p className="mt-1 text-sm text-gray-600">{t('subtitle')}</p>
				</div>
			</header>

			<main className="flex-1">
				<div className="mx-auto w-full max-w-4xl px-4 py-6">
					<div className="space-y-6">
						<SectionCard title={t('sections.tos.title')}>
							<p>{t('sections.tos.p1')}</p>
							<p>{t('sections.tos.p2')}</p>
						</SectionCard>

						<SectionCard title={t('sections.rights.title')}>
							<ul>
								<li>{t('sections.rights.i1')}</li>
								<li>{t('sections.rights.i2')}</li>
								<li>{t('sections.rights.i3')}</li>
								<li>{t('sections.rights.i4')}</li>
							</ul>
						</SectionCard>

						<SectionCard title={t('sections.privacy.title')}>
							<p>{t('sections.privacy.p1')}</p>
							<p>{t('sections.privacy.p2')}</p>
						</SectionCard>

						<SectionCard title={t('sections.disclaimer.title')}>
							<p>{t('sections.disclaimer.p1')}</p>
						</SectionCard>

						<SectionCard title={t('sections.sharing.title')}>
							<ul>
								<li>{t('sections.sharing.i1')}</li>
								<li>{t('sections.sharing.i2')}</li>
								<li>{t('sections.sharing.i3')}</li>
							</ul>
						</SectionCard>

						<SectionCard title={t('sections.contact.title')}>
							<p>{t('sections.contact.p1')}</p>
						</SectionCard>
					</div>
				</div>
			</main>

			{isFirstVisit && (
				<div className="sticky bottom-0 w-full border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
					<div className="mx-auto w-full max-w-4xl px-4 py-4 flex items-center justify-end">
						<Button onClick={handleAgree} className="px-5">
							{t('agree')}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TermsAndPolicyPage; 