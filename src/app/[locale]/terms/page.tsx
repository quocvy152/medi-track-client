import TermsAndPolicyPage from "@/components/TermsAndPolicyPage";
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from "react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <TermsAndPolicyPage />
    </Suspense>
  );
}
